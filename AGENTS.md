<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## 2.3 R1 product refinement rules

For this standalone SkillFoundry AI (`/`) page, preserve
the existing display serif and sans fonts. Use the exact page tokens in the R1
brief. Display headings use line-height 1.08, balanced wrapping, a responsive
`clamp()` size, and at most three desktop lines; sans headings use
`letter-spacing: -0.01em`. Use at most one italic accent phrase and one
high-contrast eyebrow per page. Remove decorative ordinal labels unless they
indicate a real sequence.

Keep every text color at WCAG AA contrast (4.5:1 for normal text and 3:1 for
large text). Use hard section edges and no gradients. Use Lucide `ArrowRight`
icons instead of text arrow glyphs, give icon-only buttons accessible labels,
and retain visible keyboard focus. Primary buttons use a 250ms left-to-right
fill, a 4px arrow nudge, and a `.97` active scale. Secondary buttons draw an
underline from left to right. Hero CTA magnetic movement is capped at 6px and
only runs for fine pointers.

Animate only hero and grid reveals, once, with a 12px rise and 500ms fade; in
reduced-motion mode use opacity only. Hover feedback must not cause layout
shift. Route pages need their own title, description, Open Graph image and
favicon. Navigation is full-bleed, sticky and blurred, marks the active
section, and accounts for anchor scroll offset. Implement only the explicit
R1 page requirements; keep sample-data and prototype disclosures clear.
