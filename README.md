# SellerKit — React + Vite

A modular, browser-first toolkit for marketplace sellers. This starter currently includes a working **Camera Lens Keyword Studio**, built around competitor-search patterns supplied by the project owner. The architecture is ready for more tools (title builder, SKU generator, profit calculator, barcode packing checker, etc.).

## What works

- Phone brand, model and colour inputs (including custom brands)
- 18 core keyword patterns + optional ring, glass and colour patterns
- High / Medium / Test research-priority filters
- Live keyword search, row selection, select/deselect visible terms
- Copy one or many keywords and export selected rows to CSV (Excel-friendly UTF-8)
- Settings saved to local storage, with reset button
- Responsive overview, tools directory, sidebar, browser navigation, and future-tool placeholders
- Offline generation; no database or API keys
- Unit tests for the keyword-generation engine

**Research caution:** Priority is based on impression and CTR examples, NOT on sales, conversions, or verified keyword volume. Use product-specific terms only when accurate; e.g. do not advertise a full-camera-panel film as a camera ring unless it actually is one.

## Requirements

Node.js 20.19+ or 22.12+ recommended, npm.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Production check

```bash
npm run check
npm run build
npm run preview
```

The compiled website is in `dist/`.

## Deploy on Vercel

1. Unzip this repository and push it to GitHub.
2. In [Vercel](https://vercel.com/new), choose **Add New → Project** and import the GitHub repository.
3. Vercel detects **Vite**. If prompted, set:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**. No environment variables are needed.

`vercel.json` includes an SPA rewrite so `/keywords`, `/tools`, etc. work after refreshing the page.

## Open in Codex

Codex does not run through this chat. You can open the folder in Codex locally, or push to GitHub and open that repository in Codex. See `AGENTS.md` for project-specific instructions. Example task to give Codex:

> Add a new SKU Generator tool to SellerKit. Reuse the existing design system. Implement the generator as a standalone module under `src/tools/sku-generator`, add a route and availability flag in `src/data/tools.js`, include unit tests, then run `npm run check` and `npm run build`.

## Project layout

```
src/
  App.jsx                        Shell, navigation, tool registry rendering
  components/Ui.jsx              Shared layout components
  data/tools.js                  Single source of tool metadata
  tools/keyword-studio/
    KeywordStudio.jsx            React UI for first utility
    keywords.js                  Pure keyword generation and CSV export
    keywords.test.js             Node unit tests
  styles.css                     Global design tokens/styles
```

## How to add another tool

1. Create `src/tools/my-tool/MyTool.jsx` and move its reusable logic to standalone JS files if needed.
2. Add its metadata to `src/data/tools.js` and set `available: true`.
3. Import it in `src/App.jsx` and render it when `page === 'my-tool'`.
4. Add tests for its business logic and update the `check` script.
5. Run the unit tests and build before deploying.

## Privacy

The app currently stores only keyword inputs in this browser's local storage. No data is uploaded to any external service by the app. The UI uses Google Fonts when online; you may remove the font import to eliminate that request.
