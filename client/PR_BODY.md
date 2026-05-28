## PR: feat(ui): UI refresh part 2 — theme utilities + card entry animations (NSoC'26 #188)

This PR bundles the UI refresh work for Issue #188. It refines color tokens, gradients, shadows, and CTA animations, and adds motion to card components for a livelier, gentler UI. This is intended as the final PR for the issue — please review the screenshots below and the testing steps.

Summary of changes
- Refined design tokens and color palette in `client/src/index.css` (palette variables, CTA gradient, shadows, card radius).
- Added CTA utilities: `btn-cta`, `btn-cta-ghost`, `btn-cta-sweep`, `btn-cta-pulse` and the `.cta-section` background treatment.
- Soften primary color and global font (`Plus Jakarta Sans`), improved font-smoothing and spacing.
- Updated `client/src/pages/Home.jsx` to use the new CTA classes and adjusted hero layout for improved spacing.
- Updated `client/src/components/Navbar.jsx` to consume theme classes (`bg-primary`, `text-primary`, `btn-primary`, `btn-outline`) for a consistent look.
- Improved card hover and shadow utilities (`card-hover`, `shadow-elevated`) and used them across skeletons and recommended worker cards.
- Added minor motion wrappers and Framer Motion usage for recommended worker cards (staggered entry) and pulse/shimmer animations for primary CTAs.
- Hindi translations extended for `nav`, `hero`, `stats`, `howItWorks`, `cta` keys so the language toggle shows translated UI.

Files changed (high level)
```
${"" /* The full file list is in the branch. See the compare page for file diffs. */}
```

Testing
1. From repo root:

```bash
cd client
npm install
npm run dev
# open http://localhost:5175 (or the port Vite reports)
```

2. Verify:
- Hero: headline, subtext and two CTAs (Find a Pro, Become a Pro) use the new styles and layout.
- CTA: primary CTA has gradient, subtle pulse and hover lift; ghost CTA has blurred backdrop and border.
- Cards: recommended worker cards animate into view and lift on hover with softer shadows and rounded corners.
- Navbar: buttons and links use the new theme tokens.
- Language toggle: switch to Hindi and confirm translations appear for Navbar, Hero, Stats, How It Works and CTAs.

Screenshots
- I captured screenshots while running the app locally. Attach them to the PR description (drag into the PR editor) and position them near the relevant sections.

- Suggested screenshots to attach:
  - `hero.png` — hero (headline + CTAs)
  - `recommended-cards.png` — recommended worker cards showing entry animation (or stills after load)
  - `cta-states.png` — CTA hover/normal/pulse states

PR notes
- This PR aims to be the final PR for Issue #188 (UI refresh). When creating the PR, add the PR reviewer(s) and include `Closes #188` in the PR description to automatically link/close the issue.
- If you prefer, I can squash commits before you create the PR (I can do this here if you'd like).

Thanks — please paste this content into the PR body on the compare page and attach the screenshots. If you want, I can also try to create the PR via `gh` after you install `gh` locally or authorize me to run it here.
