# Trionn fidelity pass

## Goal
Improve the isolated homepage against the measured Trionn reference. Preserve the portfolio in the parent workspace.

## Existing state
The homepage runs, but hero geometry, About, facts, services and gallery contain large substitutions. Existing assets and research are reused. Parent PRD/SPEC describe the separate portfolio; this clone keeps its English source content and existing template structure.

## Constraints
All edits and downloads stay in `_website-cloner`. No production bundles or screenshot-based page implementation. Keep reduced motion, bounded rendering and accessible DOM content.

## Solution and ownership
- Hero component and procedural geometry: dedicated section agent.
- Service frame sequence and renderer: dedicated section agent.
- Gallery perspective and scroll scene: dedicated section agent.
- Root: measured layouts, About reveal, facts/media/counters, overlays, integration and QA.

## Steps
- [x] Inspect source and current implementation, identify the largest differences.
- [x] Match hero typography, mobile CTA arrangement and header controls.
- [x] Restore dark About, Vision and stripe transition.
- [x] Rebuild fact cards with original videos and animated values.
- [x] Integrate monogram, scroll sequence and perspective gallery.
- [x] Compare 1440×900, 768×1024 and 390×844, forward/reverse scroll and controls.
- [x] Run lint, typecheck, build; document remaining differences.

## Verification
Use DevTools in-memory screenshots and geometry measurements. Check keyboard overlays, scroll reversal, reduced motion, missing assets and console. Use project-local Playwright runtime for deterministic flows to avoid MCP output escaping the isolated repo.

## Decisions
Repair reference mismatches rather than inventing a new art direction. Asset fidelity comes first. Independent section ownership follows the clone skill delegation workflow.

## Result
Delivered fidelity repairs. Fresh production output measured 25,472px desktop / 19,233px mobile, versus reference 25,508px / 19,061px. Checks pass. See docs/research/trionn/FIDELITY_REPORT.md for evidence and remaining gaps. No pixel-perfect equivalence is claimed.

## Unexpected findings
The mobile gallery is pinned too: measured total pin space4,642px. The original report understated that behaviour. Browser profile sharing prevented section agents from fresh browsing; root inspected live source and integrated their changes against recorded and live screenshots. A footer-art agent continuation could not run because of a usage limit; root completed that component. Development CSS was stale during simultaneous production builds; final checks used a fresh production server.
