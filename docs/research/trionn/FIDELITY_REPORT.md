# Trionn: second comparison and fidelity repairs

The original build report describes the first prototype. This report supersedes its implementation status, without claiming complete equivalence.

## Material changes

- Hero uses the three hooked contours traced from the original logo, with bevelled extrusion. Diagonal threads replace orbital rings. Pointer triggers an electrical segment; holding disperses actual mesh fragments. Word changes use a 1.05-second scramble.
- Desktop hero heading is measured at 90/81 px and x≈30.6 px at 1440×900. Mobile heading is 45.7/42.7 px, starts around y76; CTAs are stacked and sized like the source. Wide desktop typography caps at the measured source maximum.
- About is dark, with the source statement, asymmetrical indent, scroll-driven word reveal, divider and two lower columns.
- Vision uses the same reconstructed 3D geometry, a horizontal time-driven ticker and scroll-driven five-stripe transition to the light scene.
- Facts have the original awards/team clips, the source card layouts, rotating awards and animated numeric values. Mobile cards remain manually swipeable.
- Work heading and closing copy are inside the horizontal rail. Source images are about 40vw wide, with staggered card heights. The invented heading/year range and unsolicited image hover zoom were removed.
- Services uses all 371 local source frames, six exact desktop descriptions/SVG illustrations, four mobile labels, and the original smoke videos. Scroll drives frame selection in both directions. Decoded-image cache is bounded and rendering pauses offscreen.
- Design in Motion now uses a perspective Three.js image scene on desktop and a scroll-pinned six-image DOM composition on mobile. Pin spaces are 6,750 px at desktop 900px height and 4,642 px at mobile 844px height.
- Testimonials heading, columns, square portraits, controls and source quotes were corrected.
- Contact includes Company / Website, source field order, wording and a booking link. Native selects and mailto remain local substitutions.
- Footer layout, clock, overlap with gallery, and scanline lettering were rebuilt. The canvas has subtle time and pointer motion, with an offscreen/reduced-motion fallback.

## Source assets added

- `public/sites/trionn/stone/frame_0001.webp` … `frame_0371.webp`: 13,176,914 bytes total.
- `public/sites/trionn/services/service-01.svg` … `service-06.svg`: source graphic paths.
- `public/sites/trionn/video/awards*.mp4`, `team*.mp4`: desktop/mobile source clips.

## Rendered comparison

| Measurement | Local | Reference observed in this pass |
|---|---:|---:|
| 1440×900 document height | 25,472 px | 25,508 px |
| 390×844 document height | 19,233 px | 19,061 px |
| Hero desktop font / line height | 90 / 81 px | 90 / 81 px |
| Desktop Design in Motion pin space | 6,750 px | 6,750 px |
| Mobile Design in Motion pin space | 4,642 px | 4,642 px |

Heights depend on viewport, font loading and sticky state. Matching document height does not establish matching pixels or animation timing.

Screenshots saved in this isolated repo:

- `screenshots/fidelity-desktop-hero.png`
- `screenshots/fidelity-mobile-hero.png`
- `screenshots/fidelity-desktop-footer.png`

Source screenshots remain in the same directory. No source production bundles are used as the implementation.

## Checks actually performed

- Final `npm run check`: lint, TypeScript and production build passed.
- Fresh production browser pass at 1440×900, 390×844, 768×1024: no horizontal document overflow; zero broken loaded images; zero JavaScript runtime errors.
- Desktop menu open/Escape, contact open/Escape, Company field, keyboard focus within dialog and carousel next passed.
- Real wheel input exercised service frame progression and reversal: frames 56 → 193 → 111.
- Earlier forward/reverse page sweep at mobile/tablet passed; final forward sweep repeated on fresh production assets.
- Reduced motion: no pin spacers, videos paused, hero word stable over 3.9 seconds, footer overlap removed and static gallery remained readable.
- DevTools screenshots inspected hero, About, services, gallery and footer. The upstream React Three Fiber `THREE.Clock` deprecation warning remains.

Development CSS was stale after building alongside the dev server. The server was stopped, checks repeated, and browser measurements were taken again against fresh production output. A later REA pass improved hero material contrast and project-caption timing; see `REA_PASS.md`. Its fresh production preview is http://127.0.0.1:3001/ because port 3000 is used by another project.

## Remaining differences

1. Source material, reflections, geometry deformation, fragment distribution and electrical shader are not recovered. Hero still has a different rotation/light programme.
2. Hero, About and Vision use separate paused canvases. The source carries one shared scene through these chapters, with more complex scroll choreography.
3. Fact values count numerically instead of reproducing the source's full rolling-digit mechanics. Mobile fact cards are manually swipeable rather than source scroll-controlled.
4. Work and services have separate timelines. Their combined source transition and desktop service-card trajectories are not matched exactly.
5. Gallery perspective was authored and tuned from screenshots; its entire path, card ordering at every phase and shader behaviour remain approximate.
6. Footer smoke and scanline distortion are an authored 2D approximation. Source sound effects are not reproduced in full.
7. Testimonial audio is disabled. Contact uses mailto rather than the original backend and custom dropdowns.
8. Out-of-scope About, Services and case pages link to Trionn. They are not local routes.
9. No pixel-diff score, Lighthouse result or full performance trace is claimed.

Only `_website-cloner` contains source edits/downloads. Browser tool diagnostic logs written outside the isolated folder during this pass were removed by exact filename; prior workspace files were preserved.
