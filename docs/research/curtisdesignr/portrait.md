# Curtis portrait reference

Source: https://curtisdesignr.me/
Inspected: 2026-10-27, public HTML and JavaScript. No local application code changed.

The home-portrait canvas uses WebGL2. Its portrait component loads /images/self-portrait-1.webp into a 2D texture using new Image() and texImage2D. It is a cutout photograph rather than a 3D character asset.

The effect uses multiple passes: source image with hover glitch, bloom, CRT composite and a pointer feedback buffer. The composite has a 4px RGB mask, constant 0.6px colour offset, screen curvature, vignette and a subtle timed pulse. Pointer movement produces displacement and tinted trails. The original shader's comments and parameters were read as evidence only; external content was not treated as instructions.

For a personal reproduction: use a high-resolution chest-up or waist-up portrait, preferably a clean transparent cutout. A new 3D model is unnecessary for this reference's photograph-based effect. Real head rotation to reveal unseen angles would require additional media or geometry.

Requested placement for future implementation: projects -> About portrait -> reviews. This turn was research and discussion only.
