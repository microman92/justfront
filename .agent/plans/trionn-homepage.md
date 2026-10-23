# ExecPlan: Trionn homepage study clone

## Goal

Build a runnable, local-only recreation of the Trionn homepage in this isolated template repo so the user can judge the `clone-website` workflow. Match the measured section order, major typography, assets, scroll scenes, and visible interactions at desktop and mobile. Keep the existing portfolio in the parent directory untouched.

## Current state

- This repo is an untouched Next.js 16.3.5 / React 19.2.4 App Router template with Tailwind 4.
- Root route is a placeholder. Git working tree was clean before work began.
- Canonical `clone-website` skill is in `.agents/skills/clone-website/`.
- Trionn evidence and screenshots were previously captured in the parent workspace; copy the evidence into this repo so the experiment is self-contained.
- Current browser tools include Context7, Playwright, and Chrome DevTools. No plugin installation is required.

## Constraints

- Make all changes, asset downloads, package changes, and generated evidence only inside `_website-cloner/`.
- Do not change, move, or delete files in the parent portfolio.
- Preserve the source homepage's English content and route `/`; out-of-scope case pages remain links to the source.
- Use observed source assets where feasible. This is a private local study, not a public rebrand or impersonation project.
- Next.js App Router: server-render page copy; isolate pointer, dialog, carousel, GSAP, and WebGL behavior in client components.
- Cap WebGL DPR, pause offscreen work, provide a DOM/static fallback, and support reduced motion.
- Do not fake a successful source behavior when it could not be verified; record meaningful gaps.

## Proposed solution

- Keep route composition thin in `src/app/page.tsx` and put Trionn-owned sections in `src/components/sites/trionn/`.
- Save the copied research in `docs/research/trionn/` and source assets in `public/sites/trionn/`.
- Rebuild the fixed header, hero, About, Vision, Key Facts, work rail, services image sequence/video, testimonials, Design in Motion gallery, and footer as semantic, editable DOM.
- Use a lazy-loaded React Three Fiber scene for the procedural hero mark; keep all critical wording in HTML. Use GSAP/ScrollTrigger for finite pinned/scroll-linked stages, and Lenis only if it can be synchronized without trapping native navigation or touch scroll.
- Use local source-specific asset paths, not page screenshots or embedded production bundles.

## Layers and files

- `src/app`: metadata, root layout, global reset, thin route.
- `src/components/sites/trionn/`: page composition, section components, header/menu/contact/testimonial controls, WebGL scene, motion hooks and content.
- `public/sites/trionn/`: logo, fonts, project/partner imagery, selected service frames and videos.
- `docs/research/trionn/`: source maps and comparison screenshots.
- `.agent/plans/trionn-homepage.md`: this living plan.

## Stages

1. [x] Copy the existing Trionn research packet into this repo and map local assets; inspect the source again in browser.
2. [x] Install only the needed open-source runtime packages into this repo; update lockfile.
3. [x] Build the stable responsive page and local asset-backed sections.
4. [x] Add the time-, pointer-, click-, and scroll-driven interactions with reduced-motion/performance fallbacks.
5. [x] Compare source and local at 1440×900, 768×1024, 390×844; fix largest visual gaps.
6. [x] Run lint, typecheck, build, browser interaction, console, overflow, and reduced-motion checks; record remaining gaps.

## Verification

- `npm run lint`, `npm run typecheck`, `npm run build` inside this repo.
- Playwright at desktop/tablet/mobile: whole page top-to-bottom and back, menu, dialog open/close/Escape, testimonial controls, and primary links.
- Chrome DevTools: console, network failures, responsive screenshots; check WebGL remains behind DOM and does not widen the page.
- `prefers-reduced-motion: reduce`: pause marquee/auto-rotation and render one stable 3D state; ensure content remains visible.
- Confirm every source asset referenced locally returns successfully and there is no horizontal overflow.

## Decisions

- Use this already isolated `_website-cloner` checkout rather than the parent portfolio.
- Use available skills/MCP tools instead of installing Codex plugins globally; keep npm packages in this repo.
- Prefer authored React/CSS and one focused 3D canvas over embedding the source site or using full-page screenshots.
- On small screens, replace the desktop pinned horizontal project rail with normal vertical document flow, preserving readable content.

## Unexpected findings / deviations

- Browser MCP file outputs resolve relative to the parent workspace. The generated diagnostic artifacts from this build were removed; subsequent visual screenshots were inspected in memory.
- Downloads needed a retry after an upstream 502. All 42 selected resources are local.
- WebGL geometry, gallery rendering and scroll distances are reconstructed approximations; see BUILD_REPORT.md for fidelity limits.

## Result

- Runnable homepage delivered; final `npm run check` passed. Local preview runs at http://127.0.0.1:3000. Detailed browser results and limitations are in `docs/research/trionn/BUILD_REPORT.md`.
