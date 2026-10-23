# REA fidelity pass

## Goal
Use a project-local REA installation to inspect the live Trionn page and shipped JavaScript, then repair a verified visual or motion difference in the isolated clone.

## Existing state
The earlier fidelity pass left approximated hero shading and project-card caption timing. The clone is a Next.js app in `_website-cloner`.

## Constraints
Keep all installation, captures and code changes in this project. Do not copy production bundles into the implementation. Preserve reduced motion, DOM content and the portfolio in the parent workspace.

## Solution and affected files
Install `rea-agents` under `.rea-tools` and its skill under `.codex/skills`. Use the REA CLI without a user-level MCP registration. Inspect the original browser page and selected public script chunks. Repair `orbit-canvas.tsx` and `visual-sections.tsx`; record evidence in `docs/research/trionn/REA_PASS.md`.

## Steps
- [x] Install and read REA locally.
- [x] Capture the live page and analyze four original JS chunks.
- [x] Identify a concrete project-card timing rule and compare hero shading.
- [x] Implement the caption sequence and reflective hero material.
- [x] Run lint, typecheck and build; inspect desktop, mobile and reduced-motion output.
- [x] Clean temporary browser profiles and document remaining gaps.

## Verification and result
`npm run check` passed. Fresh production preview at `http://127.0.0.1:3001/` has no horizontal overflow at desktop or 390px mobile width; reduced motion has no pinned scenes. The REA evidence IDs and limitations are in `REA_PASS.md`. Full 1:1 equivalence remains unverified.

## Decisions and unexpected findings
REA's standard setup writes user-level Codex configuration, so this pass uses its locally installed CLI and repo skill. The first browser capture failed inside the restricted process; a separate Chrome process with permission completed the live capture. JS source recovery requires Wakaru on Linux and was not used. The existing port 3000 belongs to another project, so this clone uses port 3001.
