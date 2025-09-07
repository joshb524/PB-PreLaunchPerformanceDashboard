# Meta Ads Iterative Dashboard

A lightweight, client-only dashboard for exploring and iterating on Meta Ads performance data. Upload a CSV export and view campaign, ad set, and ad metrics with recommendations and iteration tracking. Designed for pre-launch reservation campaigns with a CPR goal of $10.

## Features
- 14-day activity grid by ad with spend and purchase tooltips
- Collapsible campaign → ad set → ad tree with KPI mini-cards and delivery status
- Rule-based recommendations with progress tracking
- Iteration workflow: new, save, restore, export/import
- LocalStorage persistence and clear-all option
- Works offline after first load; no external dependencies

## GitHub Pages
This project is designed for GitHub Pages. Enable Pages in repository settings and choose **main** branch, **root** directory. The included workflow deploys automatically on push to `main`.

Final URL pattern:
```
https://<user>.github.io/meta-ads-iterative-dashboard/
```

## Usage
1. Open the dashboard in your browser (GitHub Pages or local `index.html`).
2. Upload a Meta Ads CSV export via the file picker or load the bundled demo data.
3. Explore metrics, notes, and recommendations.
4. Save or restore iterations. Export or import JSON snapshots for sharing.
5. Benchmarks and guardrails can be edited in `src/benchmarks.js`.

## Benchmarks & Guardrails
Edit default benchmarks and guardrails in `src/benchmarks.js`. Changes take effect on reload.

## Data Privacy
All data stays in your browser. No network requests are made. Local data can be cleared via the "Clear all local data" button.

## Limitations & Known Issues
- XLSX files are not supported; export CSV from Meta Ads before uploading.
- Large exports may impact browser performance.
- Trend calculations require at least three calendar days of data.

## Changelog
### v0.1.0
- Initial release.

## Credits
Inspired by earlier PixyBeam dashboard threads: 0903T10, 0903T11, 0904T16, 0903T15.
