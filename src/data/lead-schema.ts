import { z } from "zod";

const phoneSchema = z.string().transform((value) => {
  const compact = value.trim().replace(/[\s()-]/g, "");
  const withoutCountry = compact.replace(/^\+?91(?=\d{10}$)/, "");
  return withoutCountry.replace(/\D/g, "");
}).refine((value) => /^[6-9]\d{9}$/.test(value), "Enter a valid 10-digit Indian mobile number.");

export const createLeadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  phone: phoneSchema,
  consent: z.literal(true),
  consentText: z.string().max(300),
  website: z.string().max(0).optional(),
  source: z.object({ ctaId: z.string().max(100), page: z.string().max(200), referrer: z.string().max(500).optional() }).passthrough(),
});

export const updateLeadSchema = z.object({
  leadId: z.string().uuid(),
  persona: z.enum(["Student", "Early-career professional", "Working professional", "Team lead", "Other"]),
  organisation: z.string().max(120).optional().default(""),
  city: z.string().max(100),
  programme: z.string().max(120),
  schedule: z.enum(["Weekday evenings", "Weekends", "Not sure"]),
  goal: z.string().max(500).optional().default(""),
  website: z.string().max(0).optional(),
});
