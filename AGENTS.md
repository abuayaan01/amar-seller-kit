# Codex project guidelines — SellerKit

You are working on a React 18 + Vite 6 modular toolkit for marketplace sellers in India. Keep the deployment compatible with Vercel's static hosting and SPA routing.

## Product goals
- Speed: users should be able to run a tool with a handful of inputs and copy/export immediately.
- Accuracy: distinguish observed research signals from verified sales and conversion results. Avoid misleading marketplace claims.
- Extensibility: add one isolated feature module per tool and reuse the shell and components.
- Responsiveness: work on desktop and mobile.
- Privacy: work offline where possible; do not add databases or external APIs unless a feature requires them.

## Code organisation
- `src/data/tools.js`: registry that powers both sidebar and tool directory.
- `src/App.jsx`: navigation and mounting of tool pages. New routes must use the existing SPA history pattern.
- `src/tools/<tool-name>/`: tools with presentation separated from pure logic.
- `src/styles.css`: existing visual design. Match dark navy surfaces, soft violet accents, consistent 8–15px radii.

## Conventions
- Use functional React components and hooks.
- Prefer native browser APIs and small dependencies.
- Keep generated data deterministic; avoid invented marketplace metrics.
- Ensure buttons actually work and inputs are labelled/accessibility friendly.
- Add unit tests for calculation and parsing logic.
- Run `npm run check` and `npm run build` before handing off.
- Don't delete or overwrite the Keyword Studio while creating new tools.

## Suggested roadmap
1. SKU Generator: define reusable naming rules and copy/export short IDs.
2. Listing Title Builder: per-product title templates and character-count warnings.
3. Bulk Keyword Generator: paste model list or import CSV, export grouped keywords.
4. Profit Calculator: Flipkart fees, packaging, customer returns, tax credits with careful tax assumptions.
5. Barcode Packing Checker: manifest parsing/scanning workflow; consider privacy and camera permissions.
