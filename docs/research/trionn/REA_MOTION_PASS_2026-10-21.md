# REA motion pass — 21 October 2026

## Evidence and limits

REA CLI 6.7.0 traced the previously captured public JavaScript bundle in `.rea-tools/rea-js-analysis.json` (Evidence `ev_30491dcd9a4dc88cd2f4faf766bccfe769d967f4f1ecdcab41fa806cbe9d9a21`). A module trace of `0sue_k2sp00no.js` returned a partial graph (`ev_935413a87e350e8833eab75901d09496d29a44390dfed6921fb8970b101e3908`). The graph alone cannot establish visible runtime timing, so the values below were checked in Chrome DevTools on the live page and compared with the local production page in Playwright.

REA MCP was not registered in this active session. The locally installed REA CLI and public bundle evidence were used. An attempted owned CDP capture could not start Chrome because its GPU process exited. This pass therefore does not claim a complete REA runtime trace or exact shader recovery.

## Measured source timeline

Desktop viewport: 1440 × 900. The public bundle defines a combined pinned Work/Services timeline of 1350% of viewport height: 200% work rail, 150% hand-off, 800% stone/services, 200% exit. The pin also occupies a base 100vh, so its document height is 1450vh. The stone uses 371 frames. Service cards start at normalized service progress 0.56; the headline breaks apart around 0.35–0.53. The source stone frame was 86 at page scrollY 9500, 240 at 12500 and 371 at 15500. The source testimonials section starts around document y 17742; the gallery pin begins at y 18723.

Mobile viewport: 390 × 844. The source Vision starts at 1688, Key Facts at 2954, Services at about 5967 and Testimonials at about 13563. Key Facts remains pinned while vertical scroll moves the card strip; the third card was centered at scrollY 3450. The mobile Services entrance is light, turns dark, and holds the stacked discipline names over the stone. Its stone remained at frame 1 around scrollY 6500 and reached frame 42 around 7300.

## Local changes

- Work rail duration now takes 250vh after its own 100vh section. Services is 1100vh, with 1000vh of scroll travel split into 800vh active stone sequence and 200vh exit. The desktop Work, Services and Testimonials boundaries now coincide with the source's measured positions.
- The large discipline words remain through the early stone motion, scatter on scroll, and yield to paired service cards after progress 0.56. Desktop service cards enter from opposite sides. The 371-frame stone remains local and scroll-controlled.
- Mobile Vision is 150vh. Key Facts pins for 100vh, with vertical scroll driving the horizontal card strip. Work overlaps the final 50vh of Facts, matching the source's section hand-off. The strip responds to reverse scroll.
- Mobile Services starts on a light screen, transitions to dark, and delays the stone frames. The Work/Services and Services/Testimonials boundaries are now within a few pixels of the measured source at 390 × 844.
- In the production viewport pass, the local Services boundary was y 5969 against source y 5967. At page scrollY 7300, the local stone displayed frame 43 against source frame 42. At desktop scrollY 9500 and 12500, the local stone displayed frames 86 and 240 respectively, matching the source. Local Testimonials begins at y 17742, matching the source; local gallery pin begins at y 18722 versus source y 18723. The mobile entrance still has a simplified gray Work hand-off without the source's pinned closer copy.
- The desktop footer CTAs use a vertical stack, as observed in the reference.

## Drivers and remaining differences

Hero/About/Vision: scroll, with pointer and press interaction on the hero object. Key Facts: scroll (mobile card strip), time (videos), viewport entry (counters). Work: scroll. Services: scroll and time (smoke video). Testimonials: time and click. Gallery: scroll and click on links. Footer: hover and click.

The desktop gallery now has three scroll states: an opening arc, a layered WebGL tableau, and a six-card grid. The source at scrollY 19000, 20500, 22000 and 23000 was compared with the local page at the same 1440 × 900 viewport. The cards and title change position with scroll, and the six-card grid uses the source's visual order. The placement and perspective remain approximate. The hero shader and exact fragments, Work-to-Services overlap, service letter trajectories, gallery camera path, and testimonial audio also remain different. The source and local page are not pixel-identical.

Final local check: the grid's first row is at viewport y 184 at scrollY 22000, matching the source's approximately y 185. The lower cards are at y 491, 588 and 778 during entry, close to the source's staggered positions. At scrollY 23000 all six cards are fully visible in two rows. Reverse scroll to 20500 restores the WebGL tableau and hides the grid. At 390 × 844 the separate mobile grid has no horizontal overflow; reduced motion shows six static cards. `npm run check` passed, and Chrome DevTools showed no console errors (one pre-existing Three.js Clock deprecation warning).

## Continuation — 22 October 2026

The desktop Work rail now finishes its horizontal travel in the source's 200vh phase, then shifts the entire gray Work panel left while a white Services preview enters from the right over 150vh. At 1440 × 900 and scrollY 5400, the local project cards begin at x -73, 647 and 1367 versus source x about -72, 641 and 1353. At scrollY 7000, the local white panel begins at x 890 versus source x about 866; the Work closer text begins at x 309 and y 398, close to the source x 309 and y 399. Services still begins at document y 7842, and the white introduction continues into the dark stone sequence. The preview typography is an approximation of the reference's moving headline.

The Work ScrollTrigger now uses a GSAP media query. Desktop → mobile removes the pin without reload; at 390 × 844 and scrollY 5000 the Work top is -780 rather than stuck at zero, and Services remains at y 5969. Mobile → desktop restores the pin. Reduced motion removes it and keeps the Services overlay hidden. No horizontal overflow or console errors were observed. `npm run check` passed after these changes.

## Hero material follow-up — 22 October 2026

At 1440 × 900, the source hero mark rotates through both a narrow edge-on profile and a broad three-part profile. The apparent width therefore changes with time. The stable material difference was a nearly black glass body with a concentrated ivory-to-amber highlight on selected faces; the local mark had uniformly gray faces and bright outlines. The local procedural geometry now uses a face color gradient, weaker environment and edge reflection, and a softer warm point light. This is a visual approximation, not the source shader.

At scrollY 780, the source About scene retained a dark blueprint with subdued floating fragments. The local fragments and large slabs were too bright. Their materials are now unlit and darker, while the intact mark keeps its physical glass material. The existing scroll breakup and reverse reassembly logic was not changed. `npm run check` passed. Exact piece count, paths and visibility still differ from the source.

The rebuilt production page was reopened in Chrome DevTools at scrollY 780. Its blueprint and large fragments are visibly darker. Chrome reported no console errors; the existing Three.js Clock deprecation warning remains. Playwright moved through scrollY 0 → 780 → 2200 → 0, reached each position, and reported no errors. The preview is running at `http://127.0.0.1:3002/`.

## First four screens refinement — 22 October 2026

The supplied screenshots showed a bright assembled mark visible between Vision's gray wipe strips and on the light Key Facts surface. A fresh 1440 × 900 comparison found the source mark dark in Vision at scrollY 2200 and only faintly present at 2700; the local mark was still white and orange at both positions. The local material now reduces its color, environment reflection, specular response and edge glow as scroll enters Vision. The canvas fades between approximately 2.4 and 3.2 viewport heights, with the end clamped to precede the actual Intro sequence boundary. Desktop at scrollY 2700 has canvas opacity 0.25; it is 0 by 2880, while Key Facts begins at 3600. Reverse scrolling restores opacity. On mobile 390 × 844, canvas opacity was 0 at scrollY 2850, before Key Facts pins at 2954. With reduced motion at 1440 × 900, opacity reached 0 at 2600, before Key Facts begins at 2700.

The previous shard extrusion used thick beveled geometry and made many visible rectangular blocks in About. The new small fragments are thin, unbeveled translucent triangles with sparse gray highlights. The blueprint and large dark pieces remain. This removes much of the blue block appearance but does not recover the source's exact fragment choreography. The intact hero retains a limited ivory/amber highlight on dark glass. Final `npm run check` passed; desktop/mobile had no horizontal overflow and DevTools showed no errors, only the existing Three.js Clock deprecation warning.
