# REA investigation and repair pass

## Local setup

- `rea-agents` 6.7.0 is installed under `.rea-tools/`; its workflow is in `.codex/skills/reverse-engineer-anything/`.
- REA was run through its project-local CLI. No user-level MCP or skill configuration was changed.
- Analysis artifacts and the four public source chunks remain in ignored `.rea-tools/`. They are evidence, not implementation code.

## Evidence

| Capture | REA Evidence ID | Result |
|---|---|---|
| Live Trionn CDP observation | `ev_5d03f80e16abe1e09776b5f1ea066bdff5b5ee7f95bd5f07e99bb5385d816678` | 5,322 DOM nodes, 33 script records, 43 resource records in the observed page. |
| Static analysis of four shipped JS chunks | `ev_30491dcd9a4dc88cd2f4faf766bccfe769d967f4f1ecdcab41fa806cbe9d9a21` | Four JS modules and 34,592 static semantic nodes. |

The static graph records syntax and relationships; it does not prove which code ran during an interaction. Live observation begins when REA attaches and excludes earlier network activity.

In the `0sue_k2sp00no.js` chunk, the work card has a 670:460 media aspect ratio and a 50% viewport panel with desktop inner padding. Its caption is initially hidden and a paused GSAP sequence reveals title, description and link over 0.7, 0.6 and 0.4 seconds when the parent work scene plays that panel. The local rail already approximated panel and image placement; its caption appeared immediately.

## Changes

- Added a generated studio reflection environment and a restrained silver gradient to the hero's upper-right 3D shape. This addresses the large flat-dark area found in the desktop screenshot comparison; the original shader and reflection path remain unknown.
- Added the observed staggered caption reveal as cards enter the desktop rail. Mobile and reduced-motion content remains visible without animation.
- Ignored the local REA workspace from Git and ESLint so downloaded analysis files do not affect the app checks.

## Verification

- `npm run check` passed: lint, TypeScript and production build.
- Production desktop at 1440px: the hero renders with stronger material contrast, the project card content is visible after entry, no horizontal overflow and no JavaScript errors.
- Production mobile at 390×844: 19,264px document height, no horizontal overflow; reduced motion reports zero pin spacers and visible project captions.
- Console retains an upstream `THREE.Clock` deprecation warning from the React Three Fiber stack and image dimension notices. These are not new runtime errors.

The preview is `http://127.0.0.1:3001/`. Port 3000 is occupied by a separate local project. The clone still differs from Trionn in the original WebGL shader, scene continuity and several scroll trajectories; this pass does not establish pixel-perfect parity.
