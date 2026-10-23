# Trionn local study

- [x] Copy source research into this isolated project.
- [x] Install required free runtime dependencies locally.
- [x] Localize fonts, artwork and short video assets.
- [x] Build homepage sections and interactive controls.
- [x] Add responsive and reduced-motion layouts.
- [x] Verify menu, dialog, carousel, responsive overflow and loaded images.
- [x] Record fidelity gaps in `docs/research/trionn/BUILD_REPORT.md`.
- [x] Final lint, TypeScript and production build after QA refinements.

## Fidelity repair pass

- [x] Correct measured hero type, mobile CTAs and wide-screen caps.
- [x] Rebuild monogram, pointer energy and hold fragments.
- [x] Restore dark About, Vision ticker and stripe transition.
- [x] Add source fact-card videos and animated values.
- [x] Add all 371 service frames and source service illustrations.
- [x] Rebuild desktop perspective gallery and mobile pinned scene.
- [x] Correct testimonials, contact fields and footer composition.
- [x] Compare fresh production output at desktop, mobile and tablet.
- [x] Pass lint, typecheck and build; record measured results and unresolved gaps.

Complete clone parity is not checked off: shader/scene continuity, some scroll trajectories, testimonial audio and contact backend remain unresolved. See FIDELITY_REPORT.md.

## REA investigation and repair

- [x] Install REA and its skill inside this project.
- [x] Capture the live reference and analyze selected JS chunks with REA.
- [x] Apply the observed project-caption reveal and improve hero material contrast.
- [x] Pass lint, typecheck, build and inspect desktop/mobile/reduced-motion output.
- [ ] Match the source WebGL shader and all scroll choreography exactly.

Evidence and limitations: `docs/research/trionn/REA_PASS.md`.

## Hero interaction correction

- [x] Recheck the reference: scrolling separates the hero mark during the first viewport; press and hold triggers a separate blast that settles on release.
- [x] Drive the local hero fragments from scroll position in both directions, while retaining press and hold.
- [x] Remove hover-only electric arc and pointer glow from the local hero.

## Continuous hero scene pass

- [x] Inspect Trionn at scrollY 0, 255, 764, 1359, 1955 and 2223; verify the single pinned canvas and reverse transition.
- [x] Remove the electric arc entirely, including the press state.
- [x] Use one sticky canvas across Hero, About and Vision.
- [x] Add dark glass material, continuous rotation, more procedural shards, blueprint outlines and reassembly.
- [x] Check desktop and mobile, reverse scroll, reduced motion and console.
- [ ] Match the source's exact model, shaders and fragment trajectories. The local scene remains a procedural approximation.

Observed states and limits: `docs/research/trionn/HERO_SCENE_PASS.md`.

## Full-page comparison and Key Facts boundary

- [x] Compare source and local desktop/mobile sections at matching viewport sizes and scroll positions.
- [x] Fade the shared 3D canvas out by the start of Key Facts and restore it on reverse scroll.
- [x] Retune the Vision stripe transition so the dark intervals remain visible longer.
- [x] Verify the Key Facts boundary in Playwright and Chrome DevTools; pass lint, typecheck and build.
- [ ] Resolve remaining section-by-section motion and visual differences, prioritized in `docs/research/trionn/FULL_SITE_AUDIT_2026-10-21.md`.

The page is structurally close but is not a 1:1 implementation. `clone-website` guided this audit; REA's separate earlier pass covered selected shipped JS chunks.

## Full-page REA motion pass — 21 October 2026

- [x] Reuse local REA evidence and inspect the shipped Work/Services bundle.
- [x] Verify source scroll phases with Chrome DevTools at desktop and mobile sizes.
- [x] Retune desktop Work and Services timing, stone frames, discipline headline and card entry.
- [x] Pin and scroll-drive mobile Key Facts; align Vision, Work and Services boundaries.
- [x] Add the light-to-dark mobile Services entrance and align the footer CTA stack.
- [x] Add desktop gallery arc, layered tableau and six-card grid transitions; compare their scroll states with the source.
- [x] Match desktop Work rail timing and add its sideways hand-off into Services.
- [x] Remove and restore the Work pin correctly when switching desktop/mobile and reduced motion without reload.
- [x] Pass lint, typecheck and build; verify mobile reverse scroll and console in Playwright.
- [ ] Reproduce the exact source shaders, glyph trajectories, gallery camera path and testimonial audio.

Evidence and limits: `docs/research/trionn/REA_MOTION_PASS_2026-10-21.md`.

## Hero material follow-up — 22 October 2026

- [x] Compare the rotating mark and About breakup with the live reference at 1440 × 900.
- [x] Replace the uniformly gray hero surface with dark glass and localized ivory/amber facets.
- [x] Keep exploded slabs and accent shards dark during the blueprint phase.
- [x] Pass lint, typecheck and build after the material changes.
- [ ] Recover the exact source shader, model and shard trajectories; the procedural scene is still approximate.

## First four screens refinement — 22 October 2026

- [x] Compare Hero, About, Vision and the Key Facts entrance at matching desktop scroll positions.
- [x] Darken the assembled mark through Vision, including environment reflections and edge highlights.
- [x] Replace thick block-like fragments with thin translucent triangular shards and sparse brighter accents.
- [x] Fade the shared canvas during the stripe transition and fully hide it before Key Facts, including mobile and reduced motion.
- [x] Check reverse scroll, mobile overflow, console, lint, typecheck and production build.
- [ ] Match the source model, shader and fragment paths exactly; current WebGL remains procedural.

## Video-driven glyph follow-up — 22 October 2026

- [x] Review the supplied 61.8-second recording at Hero, About, transition and Key Facts timestamps.
- [x] Compare live Trionn and local scene at 1440 × 900, scrollY 900, 1350 and 1955.
- [x] Keep the About blueprint legible while the Hero and Vision object continues to rotate.
- [x] Delay the warm large-plate glint and fade in finer shards through About; darken broad red/ivory faces.
- [x] Verify desktop, mobile, reverse scroll, reduced motion, console, lint, typecheck and build.

## Hero breakup timing correction — 22 October 2026

- [x] Recheck live Trionn using wheel steps around scrollY 127, 254, 382 and 510.
- [x] Inspect the published Hero JS and analyze that chunk with local REA CLI.
- [x] Replace the early breakup ramp with the source's 0.1–1.0 viewport progression, 1.0–1.2 hold and 1.2–1.8 reassembly.
- [x] Keep solid pieces visible through the middle of breakup and stagger fine shards.
- [x] Delay press blast until a 500 ms hold near the top of Hero.
- [x] Recheck reverse scroll, mobile, reduced motion, console, lint, typecheck and build.

## Full glyph fracture — 23 October 2026

- [x] Reinspect the source Hero bundle: its extruded surface is grouped into independently moving patches.
- [x] Replace three intact moving slabs and unrelated overlay shards with patches that assemble the entire local glyph at rest.
- [x] Keep the stationary blueprint, scroll timing, hold blast and late reassembly.
- [x] Compare source/local desktop frames at scrollY 0, 450 and 900; pass lint, typecheck and build.
- [ ] Recheck this geometry change on mobile and reverse scroll in browser automation; Playwright was blocked by the automatic approval review usage limit.
- [ ] Match the source's exact paths, patch grouping, materials and flight vectors; this remains a procedural approximation.

## Vision stripe closure — 23 October 2026

- [x] Compare the Vision → Key Facts transition with Trionn at the same desktop scroll positions.
- [x] Keep Vision pinned through the stripe close while preserving the Key Facts entrance position.
- [x] Finish all five stripes before Key Facts takes over; keep Key Facts above the outgoing scene.
- [x] Check desktop forward/reverse scroll, mobile closure, and reduced-motion layout.
## Vision responsive reference pass — 23 October 2026

- [x] Measure Trionn Vision at 580 × 757 and 390 × 844, including stripe progress and Key Facts entrance.
- [x] Match mobile typography positions and separate compact phone scene duration.
- [x] Close mobile stripes from bottom to top; verify forward and reverse scroll.
- [x] Reduce Vision reflections and background lines, retain a faint glyph outline.
- [x] Pass lint, typecheck and production build; restart preview on port 3002.
- [x] Check production at 580 px and 390 px, reduced motion and console (no errors; existing THREE.Clock deprecation warning).
- [ ] Exact glyph geometry, material and time-based orientation remain approximate.
## Work to Services handoff — 23 October 2026

- [x] Reproduce Services rising from below during its horizontal preview entrance.
- [x] Keep the pinned work scene above Services until horizontal travel completes.
- [x] Hide the outgoing preview at timeline end and restore it during reverse scroll.
- [x] Align preview typography with the initial Services scene.
- [x] Pass lint, typecheck and build. Verify desktop forward/reverse handoff, mobile and reduced-motion visibility, and console errors in production.
## Services motion and continuity — 23 October 2026

- [x] Use local REA on the published work/services JavaScript; retain Evidence and cross-check live card transforms.
- [x] Replace duplicate preview with the real Services panel during horizontal entry; preserve fixed-to-sticky position and reverse scroll.
- [x] Reconstruct paired left-up/right-down card paths, sine bend, stagger and opacity from the reference.
- [x] Smooth stone progress and prioritize nearby frame loading; increase bounded frame cache.
- [x] Add bottom-first white stripe exit and testimonial overlap.
- [x] Pass lint, typecheck and production build; verify desktop forward/reverse through Playwright, 390/768 widths, reduced motion and absence of console errors.
- [ ] Exact letter scattering, typography and SVG path drawing remain approximate.
## Services entry seam and shorter pacing — 24 October 2026

- [x] Reproduce residual left edge at 1880 × 832 near the horizontal handoff.
- [x] Finish Services coverage before pin release; verify X=0 at 20 px before handoff in both scroll directions.
- [x] Shorten Services from 1100 to 800svh on desktop and 900 to 650svh on mobile.
- [x] Advance white backdrop fade; at 500 px into the desktop scene white opacity is zero.
- [x] Verify stone frames, card phase and stripe exit; verify mobile and no console errors.
- [x] Lint, typecheck and production build pass; preview restarted on port 3002.
## REA Services → Footer fidelity and smoothness — 24 October 2026

- [x] Analyze published Services, Testimonials, Gallery and Footer chunks with local REA; retain tail-analysis-2026-10-24.json.
- [x] Measure stone appearance before optimizing using Chrome tracing and a 180-rAF scroll.
- [x] Generate 960px/640px source variants, prefetch compressed frames, bound decoded memory, cache dimensions and DOM targets, skip identical canvas draws.
- [x] Remove repeated IntroSequence layout reads from scroll callbacks.
- [x] Repeat traced measurement: mean 47.30→9.61 ms; p95 145.70→14.30 ms; >50ms intervals 53→0; distinct stone frames 50→152 on this desktop.
- [x] Add 600ms testimonial crossfade, visible-only autoplay, hover/focus pause and swipe; confirm constant slide height and keyboard activation.
- [x] Reconstruct continuous 3D helix and six-card tableau on desktop and phone; correct front/back image orientation and fade spiral guides during tableau.
- [x] Add gallery dark stripe exit and restore footer visibility/click access; verify reverse scroll.
- [x] Replace footer font mask with recovered SVG strokes and decaying hover/click wave.
- [x] Pass lint, typecheck and production build. Browser pass at 1440×900, 768×1024, 390×844 and reduced motion. No console errors or broken assets in final production checks.
- [ ] Exact text scatter, SVG icon draw, sound synthesis and smoke shader remain approximate; no claim of a pixel-identical clone.
