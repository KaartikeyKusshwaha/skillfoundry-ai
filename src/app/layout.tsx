import type { Metadata } from "next";
import "./globals.css";
import "./theme.css";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "skillfoundry-ai.vercel.app"}`),
  title: "SkillFoundry AI",
  description: "Practical AI programmes for students and young professionals.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html suppressHydrationWarning lang="en" className="h-full" data-scroll-behavior="smooth">
      <head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('site-theme');document.documentElement.dataset.theme=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}})()` }}/></head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
