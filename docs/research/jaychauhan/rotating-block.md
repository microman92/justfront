# Reference: rotating services block

Source: https://jaychauhan.framer.website/
Inspected: 2026-10-27 via public HTML and Framer page module, plus the user's five-second recording.

- Section: Services; inner element is named `3D-Element`, class `framer-16kqjml`.
- Reference has four rectangular faces. Desktop dimensions: 960 x 240 pixels. Faces have X rotations of 0, -90, -180, -270 degrees and depth of 120 pixels.
- Parent rotation uses a scroll-target transform from 0 to 320 degrees with perspective 2400px.
- Outer entrance transform goes from translateY(1800px), scale(0.4), rotateX(-45deg) to its neutral position.
- Local adaptation: six project faces, screenshot and task/solution/outcome on each face; pairwise quarter turns; perspective 2400px. Does not reproduce the source's outer entrance translation or 320-degree parent sweep.

Validation: actual local GSAP timeline sampled in Node at all six settled states, five half-turn transitions, and reverse playback; counters and inert states checked. Local HTTP response contains six project articles and serves all six project previews with status 200. TypeScript and targeted ESLint pass.

Limitation: browser navigation returned `Local browser use is disabled in Work settings`. No rendered comparison or real-wheel playback was possible. Public HTTP source was available with network permission.
