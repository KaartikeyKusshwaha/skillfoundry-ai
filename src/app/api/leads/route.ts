import { NextRequest, NextResponse } from "next/server";
import { createLeadSchema, updateLeadSchema } from "@/data/lead-schema";

type Lead = {
  id: string; createdAt: string; updatedAt: string; status: "partial" | "submitted";
  name: string; email: string; phone: string; consent: { given: true; text: string; timestamp: string };
  source: Record<string, unknown>; persona?: string; organisation?: string; city?: string;
  programme?: string; schedule?: string; goal?: string;
};

const globalStore = globalThis as typeof globalThis & { __prototypeLeads?: Map<string, Lead>; __leadRate?: Map<string, number[]> };
const leads = globalStore.__prototypeLeads ??= new Map<string, Lead>();
const rate = globalStore.__leadRate ??= new Map<string, number[]>();

function rateLimited(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (rate.get(ip) ?? []).filter((time) => now - time < 60_000);
  if (recent.length >= 5) return true;
  recent.push(now); rate.set(ip, recent);
  return false;
}

async function forward(lead: Lead) {
  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) return;
  const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(lead), signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error("Lead forwarding failed.");
}

export async function POST(request: NextRequest) {
  if (rateLimited(request)) return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
  const payload: unknown = await request.json().catch(() => null);
  const parsed = createLeadSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check the form details." }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ leadId: crypto.randomUUID() });
  const now = new Date().toISOString();
  const duplicate = [...leads.values()].find((saved) => saved.email.toLowerCase() === parsed.data.email.toLowerCase() || saved.phone === parsed.data.phone);
  if (duplicate) {
    Object.assign(duplicate, { name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone, consent: { given: true as const, text: parsed.data.consentText, timestamp: now }, source: parsed.data.source, status: "partial" as const, updatedAt: now });
    try { await forward(duplicate); } catch { return NextResponse.json({ error: "We could not send your request. Please try again." }, { status: 502 }); }
    return NextResponse.json({ leadId: duplicate.id, status: duplicate.status, duplicate: true }, { status: 200 });
  }
  const lead: Lead = {
    id: crypto.randomUUID(), createdAt: now, updatedAt: now, status: "partial",
    name: parsed.data.name, email: parsed.data.email, phone: parsed.data.phone,
    consent: { given: true, text: parsed.data.consentText, timestamp: now }, source: parsed.data.source,
  };
  try { await forward(lead); } catch { return NextResponse.json({ error: "We could not send your request. Please try again." }, { status: 502 }); }
  leads.set(lead.id, lead);
  if (process.env.NODE_ENV !== "production") console.info("Prototype lead captured", { id: lead.id, status: lead.status });
  return NextResponse.json({ leadId: lead.id, status: lead.status }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (rateLimited(request)) return NextResponse.json({ error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
  const payload: unknown = await request.json().catch(() => null);
  const parsed = updateLeadSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Please check the form details." }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ status: "submitted" });
  const lead = leads.get(parsed.data.leadId);
  if (!lead) return NextResponse.json({ error: "This request expired. Please start again." }, { status: 404 });
  Object.assign(lead, parsed.data, { status: "submitted", updatedAt: new Date().toISOString() });
  try { await forward(lead); } catch { return NextResponse.json({ error: "We could not send your request. Please try again." }, { status: 502 }); }
  if (process.env.NODE_ENV !== "production") console.info("Prototype lead updated", { id: lead.id, status: lead.status });
  return NextResponse.json({ status: lead.status });
}
