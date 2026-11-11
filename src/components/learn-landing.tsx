"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { DimensionalArt } from "@/components/dimensional-art";
import { ArrowRight, Check, Code2, FileText, Lightbulb, Menu, SearchCheck, ShieldCheck, X } from "lucide-react";
import { useScrollReveal } from "@/components/use-scroll-reveal";

type LeadState = "idle" | "submitted";
const builds = [
  { title: "A useful question", detail: "Frame a real need and define who the work should help.", result: "A clear project brief", icon: Lightbulb },
  { title: "A research brief", detail: "Use AI to gather sources, compare claims and shape a grounded direction.", result: "A source-aware insight brief", icon: SearchCheck },
  { title: "A working prototype", detail: "Turn the strongest idea into a responsive interface or workflow.", result: "A usable product prototype", icon: Code2 },
  { title: "A tested improvement", detail: "Test the experience, review what failed and refine the result.", result: "Evidence from testing", icon: ShieldCheck },
  { title: "A portfolio case study", detail: "Explain the decisions, tradeoffs and outcome in a shareable story.", result: "Work you can present", icon: FileText },
];
const programmes = [
  { title: "AI for working teams", duration: 2, audience: "For small teams and operators", price: "₹7,500", items: ["Find high-value workflows", "Design a practical system", "Bring a live use case"], featured: false },
  { title: "AI foundations", duration: 4, audience: "For students and young professionals", price: "₹4,900", items: ["Use AI tools responsibly", "Create your first workflow", "Ship one portfolio project"], featured: false },
  { title: "AI product studio", duration: 8, audience: "For students and young professionals", price: "₹12,900", items: ["Research real user needs", "Design and prototype a product", "Present three portfolio projects"], featured: true },
];

export function LearnLanding() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [leadState, setLeadState] = useState<LeadState>("idle");
  const [leadId, setLeadId] = useState("");
  const [leadStep, setLeadStep] = useState<1 | 2>(1);
  const [leadError, setLeadError] = useState("");
  const [leadBusy, setLeadBusy] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState("");
  const [activeBuild, setActiveBuild] = useState(0);
  const [activePathStep, setActivePathStep] = useState(0);
  const [activeSection, setActiveSection] = useState("curriculum");
  const [menuOpen, setMenuOpen] = useState(false);
  const revealRoot = useRef<HTMLElement>(null);
  useScrollReveal(revealRoot);

  useEffect(() => {
    const steps = Array.from(document.querySelectorAll<HTMLElement>("[data-path-step]"));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActivePathStep(Number((visible.target as HTMLElement).dataset.pathStep));
    }, { rootMargin: "-30% 0px -52% 0px", threshold: [0, .4, .7] });
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = ["curriculum", "programmes", "faq"].map((id) => document.getElementById(id)).filter((item): item is HTMLElement => Boolean(item));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-22% 0px -65% 0px", threshold: [0, .25, .5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const openLead = (programme = "AI product studio") => { setLeadState("idle"); setLeadStep(1); setLeadError(""); setSelectedProgramme(programme); setDialogOpen(true); };
  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLeadError(""); setLeadBusy(true);
    const form = new FormData(event.currentTarget);
    const body = leadStep === 1 ? {
      name: String(form.get("name") ?? ""), email: String(form.get("email") ?? ""), phone: String(form.get("phone") ?? ""),
      consent: form.get("consent") === "on", consentText: "I agree to be contacted about this programme by email and WhatsApp.",
      website: String(form.get("website") ?? ""), source: { ctaId: selectedProgramme ? `programme-${selectedProgramme}` : "reserve-seat", page: window.location.pathname, referrer: document.referrer, ...Object.fromEntries(new URLSearchParams(window.location.search)) },
    } : {
      leadId, persona: String(form.get("persona") ?? ""), organisation: String(form.get("organisation") ?? ""), city: String(form.get("city") ?? ""),
      programme: String(form.get("programme") ?? ""), schedule: String(form.get("schedule") ?? ""), goal: String(form.get("goal") ?? ""), website: String(form.get("website") ?? ""),
    };
    try {
      const response = await fetch("/api/leads", { method: leadStep === 1 ? "POST" : "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "We could not send your request. Please try again.");
      if (leadStep === 1) { setLeadId(result.leadId); setLeadStep(2); }
      else setLeadState("submitted");
    } catch (error) { setLeadError(error instanceof Error ? error.message : "We could not send your request. Please try again."); }
    finally { setLeadBusy(false); }
  };

  const build = builds[activeBuild];
  const BuildIcon = build.icon;
  return <main className="learn-theme" ref={revealRoot}>
    <nav className="site-nav learn-nav" aria-label="Main navigation"><div className="container nav-inner"><Link href="/" className="learn-brand">SkillFoundry<span>AI</span></Link><div className={`nav-links ${menuOpen ? "open" : ""}`}><a className={activeSection === "curriculum" ? "active" : ""} href="#curriculum" onClick={() => setMenuOpen(false)}>Curriculum</a><a className={activeSection === "programmes" ? "active" : ""} href="#programmes" onClick={() => setMenuOpen(false)}>Programmes</a><a className={activeSection === "faq" ? "active" : ""} href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a></div><button className="button button-ink desktop-cta" onClick={() => openLead()}>Reserve your seat <ArrowRight size={18}/></button><ThemeToggle/><button className="icon-button mobile-only" type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X/> : <Menu/>}</button></div></nav>

    <section className="learn-hero" data-reveal><div className="container learn-hero-grid"><div className="learn-hero-copy"><p className="overline hero-eyebrow">Practical AI learning · January cohort</p><h1 className="editorial-title">Build AI work <em>you can actually show.</em></h1><p className="hero-lede">Hands-on programmes for students and young professionals who want to turn curiosity into useful, reviewable work.</p><div className="hero-actions"><button className="button button-accent" onClick={() => openLead()}>Reserve your seat <ArrowRight size={18}/></button><a className="button button-secondary" href="/skillfoundry-syllabus.txt" download>Download the syllabus <ArrowRight size={17}/></a></div><p className="cohort-line"><span className="cohort-dot"/> Applications open · Next cohort starts in January</p>
        <div className="prompt-result" aria-label="Example prompt and project result"><div><span className="prompt-label">A learner prompt</span><p>“Help me make local services easier to compare.”</p></div><ArrowRight size={18}/><div><span className="prompt-label">A useful result</span><p>Research brief → tested service finder</p></div></div></div><div className="learn-hero-art rendered-hero"><figure className="rendered-still-life"><Image src="/images/skillfoundry-3d-studio.png" alt="Sculptural lilac ribbon, frosted sphere and layered ivory cards arranged as a three-dimensional creative workspace" fill priority sizes="(max-width: 1023px) 95vw, 48vw"/></figure><div className="cohort-pill"><span className="cohort-dot"/> Cohort applications open</div></div></div></section>

    <section className="outcomes-section"><div className="container"><div className="section-heading learn-heading"><div><h2>Learning that leaves evidence behind.</h2></div><p>Each module creates something you can review, improve and explain. You leave with a portfolio, not just notes.</p></div><div className="outcomes-grid">{[{ image: "learn-research.jpg", alt: "People collaborating around laptops at a workshop", title: "Make informed decisions", text: "Research with AI, then decide what belongs in the work." }, { image: "learn-design.jpg", alt: "A designer sketching interface wireframes on a tablet", title: "Build a usable prototype", text: "Use no-code and code tools to make ideas testable." }, { image: "learn-build.jpg", alt: "Two people reviewing a working project on a laptop", title: "Explain your process", text: "Show the thinking behind the outcome with confidence." }].map((item) => <article className="outcome-card" data-reveal key={item.title}><div className="outcome-photo"><Image src={`/images/${item.image}`} alt={item.alt} fill sizes="(max-width: 700px) 90vw, 30vw"/></div><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section>

    <section className="build-stage" id="curriculum"><div className="container build-layout"><div className="build-copy"><h2>Five steps from a question to a case study.</h2><p>Every step adds evidence to the final piece of work.</p><div className="build-tabs" role="tablist" aria-label="Five project steps">{builds.map((item, index) => <button key={item.title} role="tab" aria-selected={activeBuild === index} className={activeBuild === index ? "active" : ""} onClick={() => setActiveBuild(index)}><span>{String(index + 1).padStart(2, "0")}</span>{item.title}</button>)}</div></div><div className="build-screen" role="tabpanel"><div className="build-screen-top"><span>PROJECT WORKFLOW</span><span>Step {activeBuild + 1} of 5</span></div><div className="build-art"><div className="build-art-inner"><div className="step-sculpture"><DimensionalArt kind="workflow" step={activeBuild}/><span className="step-icon"><BuildIcon size={22}/></span></div><span className="art-kicker">CURRENT DELIVERABLE</span><strong>{build.result}</strong><p>{build.detail}</p></div></div><div className="progress-line"><i style={{ width: `${(activeBuild + 1) * 20}%` }}/></div></div></div></section>

    <section className="curriculum-band" aria-labelledby="path-title"><div className="container curriculum-layout"><div className="curriculum-sticky"><h2 id="path-title">From rough idea to thoughtful work.</h2><p>Follow the active steps as you move through a project.</p></div><ol>{["Understand the problem", "Make a credible plan", "Build and test the work", "Share it with clarity"].map((item, index) => <li key={item} data-path-step={index} className={activePathStep === index ? "active" : ""}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item}</strong><p>{["Frame an audience, need and useful outcome.", "Use AI to research, structure and challenge the idea.", "Turn decisions into a responsive, working prototype.", "Write a case study that explains your choices and results."][index]}</p></div></li>)}</ol></div></section>

    <section className="container programmes-section" id="programmes"><div className="section-heading learn-heading"><div><h2>Small cohorts. Clear commitment.</h2></div><button className="text-link" onClick={() => openLead("Not sure yet")}>Not sure where you fit? Ask us <ArrowRight size={16}/></button></div><div className="programme-grid">{programmes.map((item) => <Programme key={item.title} {...item} action={() => openLead(item.title)}/>)}</div><p className="programme-pricing-note"><strong>Why does the 2-week programme cost more per week?</strong> AI for working teams includes team-specific workflow mapping and live use-case facilitation in a short, concentrated format. The 4-week foundations programme is a self-contained individual learning path.</p>
      <div className="programme-comparison"><h3>Compare the programmes</h3><div className="comparison-scroll"><table><thead><tr><th scope="col">Programme</th><th scope="col">Duration</th><th scope="col">Best for</th><th scope="col">Main outcome</th><th scope="col">Price</th></tr></thead><tbody>{programmes.map((item) => <tr key={item.title}><th scope="row">{item.title}</th><td>{item.duration} weeks</td><td>{item.audience}</td><td>{item.items[2]}</td><td>{item.price}</td></tr>)}</tbody></table></div></div>
    </section>

    <section className="learn-final"><div className="container"><h2>Bring a question. Leave with work you can point to.</h2><p>Tell us what you want to build and we’ll help you choose the right programme.</p><button className="button button-accent" onClick={() => openLead()}>Reserve your seat <ArrowRight size={18}/></button></div></section>

    <section className="faq-section container" id="faq"><div><h2>Before you choose a path.</h2></div><div className="faq-list"><details><summary>Who are these programmes for?</summary><p>They’re designed for students and young professionals who want practical experience building and explaining AI-supported work.</p></details><details><summary>Do I need to know how to code?</summary><p>No. The foundations path starts with the problem and the workflow. Some projects use code, and each path explains the tools it expects.</p></details><details><summary>Does reserving a seat take payment?</summary><p>No. This demo collects an enquiry only. It does not take payment or confirm a seat.</p></details></div></section>

    <footer className="learn-footer"><div className="container learn-footer-inner"><div><Link href="/" className="learn-brand">SkillFoundry<span>AI</span></Link><p>Practical AI learning for real work. Programme details are prototype content.</p></div><a href="#curriculum" className="text-link">Explore the curriculum <ArrowRight size={16}/></a></div></footer>
    {dialogOpen && <LeadDialog state={leadState} step={leadStep} error={leadError} busy={leadBusy} programme={selectedProgramme} onClose={() => setDialogOpen(false)} onSubmit={submitLead}/>}
  </main>;
}

function Programme({ title, duration, audience, price, items, featured, action }: { title: string; duration: number; audience: string; price: string; items: string[]; featured: boolean; action: () => void }) {
  return <article className={`programme-card ${featured ? "featured" : ""}`} data-reveal><div className="programme-card-head">{featured && <span className="programme-badge">Recommended</span>}<p>{duration} weeks</p><h3>{title}</h3><p className="programme-audience">{audience}</p></div><ul>{items.map((item) => <li key={item}><Check size={17}/>{item}</li>)}</ul><div className="programme-card-bottom"><strong>{price}</strong><span className="price-note">per learner</span><button className={`button ${featured ? "button-accent" : "button-secondary"} full`} onClick={action}>{featured ? "Reserve your seat" : "Enquire"} <ArrowRight size={17}/></button></div></article>;
}

function LeadDialog({ state, step, error, busy, programme, onClose, onSubmit }: { state: LeadState; step: 1 | 2; error: string; busy: boolean; programme: string; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="drawer-backdrop" onClick={onClose} role="presentation"><section className="lead-dialog" role="dialog" aria-modal="true" aria-labelledby="lead-title" onClick={(event) => event.stopPropagation()}><button className="drawer-close" onClick={onClose} aria-label="Close"><X size={20}/></button>{state === "submitted" ? <div className="lead-success"><div className="success-icon"><span className="success-spinner" aria-hidden="true"/><Check className="success-check" size={30}/></div><p className="dialog-kicker">Enquiry received</p><h2 id="lead-title">Thank you.</h2><p>Your enquiry was accepted by the prototype. No seat or payment is confirmed; no email is sent unless the owner connects a lead webhook.</p><button className="button button-ink full" onClick={onClose}>Close <ArrowRight size={17}/></button></div> : <form onSubmit={onSubmit}><p className="dialog-kicker">Step {step} of 2 · Enquire about a programme</p><h2 id="lead-title">{step === 1 ? "Tell us how to reach you." : "Help us point you to the right path."}</h2><p>{step === 1 ? "Start with your contact details. No payment is taken here." : "A few details help us understand what you want to learn."}</p>
    <div key={step} className="lead-step">{step === 1 ? <><label>Name<input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Your name"/></label><label>Email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com"/></label><label>Mobile<input name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="10-digit mobile number"/></label><label className="consent-label"><input name="consent" type="checkbox" required/><span>I consent to contact about this course by email and WhatsApp. I can withdraw by contacting the programme team using the real operator’s published details. Read the <Link href="/privacy" target="_blank">prototype privacy notice</Link>.</span></label><label className="lead-honeypot" aria-hidden="true">Leave this blank<input name="website" tabIndex={-1} autoComplete="off"/></label></> : <><label>What describes you best?<select name="persona" required defaultValue=""><option value="" disabled>Select one</option>{["Student","Young professional","Working professional","Team lead","Other"].map((item) => <option key={item}>{item}</option>)}</select></label><label>College or company<input name="organisation" maxLength={120} placeholder="Optional"/></label><label>City<input name="city" required maxLength={100} placeholder="Your city"/></label><label>Programme<select name="programme" required defaultValue={programme}><option value="" disabled>Choose a programme</option>{["AI foundations","AI product studio","AI for working teams","Not sure yet"].map((item) => <option key={item}>{item}</option>)}</select></label><label>Preferred schedule<select name="schedule" required defaultValue=""><option value="" disabled>Select one</option>{["Weekday evenings","Weekends","Not sure"].map((item) => <option key={item}>{item}</option>)}</select></label><label>What do you want to do with AI?<input name="goal" maxLength={500} placeholder="Optional"/></label><label className="lead-honeypot" aria-hidden="true">Leave this blank<input name="website" tabIndex={-1} autoComplete="off"/></label></>}</div>
    {error && <p role="alert" className="lead-error">{error}</p>}<button className="button button-ink full" type="submit" disabled={busy}>{busy ? <><span className="button-spinner"/> Sending…</> : <>{step === 1 ? "Continue" : "Send enquiry"} <ArrowRight size={17}/></>}</button><small>Prototype enquiry only. No payment or seat reservation is made.</small></form>}</section></div>;
}


