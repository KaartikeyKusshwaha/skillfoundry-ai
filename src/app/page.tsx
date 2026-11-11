import type { Metadata } from "next";
import { LearnLanding } from "@/components/learn-landing";

export const metadata: Metadata = {
  title: "SkillFoundry AI — Practical AI programmes",
  description: "Hands-on AI programmes for students and young professionals, from first workflow to tested product prototype.",
  openGraph: { title: "SkillFoundry AI", description: "Build AI work you can actually show.", type: "website", images: [{ url: "/og/skillfoundry-ai.png", width: 1200, height: 630, alt: "SkillFoundry AI — build AI work you can actually show" }] },
  twitter: { card: "summary_large_image", title: "SkillFoundry AI", description: "Build AI work you can actually show.", images: ["/og/skillfoundry-ai.png"] },
  icons: { icon: "/icon.svg" },
};

export default function LearnPage() {
  return <LearnLanding />;
}
