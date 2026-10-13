# Household goods tools

A browser-based PPM weight planner, SIT reimbursement calculator, and personally procured NTS cost estimator for transportation counseling and move planning.

## Run locally

```sh
npm ci
npm start
```

Open http://localhost:3000. The home page opens the PPM planner; navigation switches between PPM, SIT and NTS without losing entered data. Shipment entries stay in memory for the current tab and clear on refresh. Only JBER rates explicitly saved with the preset button persist in this browser. No backend or SSN is needed.

## What changed

- Dark slate/navy styling, teal accents, mobile forms and navigation, validation and itemized summaries.
- SIT: inclusive day counts, prior-day usage, expiration, approved extensions, domestic/international HHG rates, tariff minimums and actual-cost caps.
- Actual tickets stay intact; remaining allowance and excess weight are separate.
- Correct O-5 allowance; separate aggregate member, dependent-spouse and combined military-member professional gear credits.
- Counselor-confirmed packing adjustments and allowance overrides for special cases.
- NTS starts at JBER/Anchorage with dollar defaults pending a verified current JBER rate sheet. Enter the applicable rates/source/date and use **Save as JBER defaults** to prefill them in this browser next time. Shipment authorization and rate-applicability confirmation reset in new sessions. Historical Dyess and public Fairbanks schedules are not used as JBER prices.
- Storage payment distinguishes eligible actual costs capped at GCC from explicitly authorized DAF monetary allowances, and accounts for prior payments.
- Print / save PDF uses the browser's print dialog and a dedicated print layout.

Policy review: **12 October 2026**, using the attached **DAFI 24-602 V4, 2 June 2026**, and current-index DTR Part IV chapters. See [source mapping, calculation decisions and limits](docs/policy-review.md). The worksheet assists planning; official entitlement, rates, exception handling and settlement require transportation-office review.

## Verify

```sh
CI=true npm test -- --watchAll=false --runInBand
npm run build
```

The production build targets `/hhg_calculator/` from `package.json`. Hash routes support GitHub Pages without server rewrite rules: `/#/ppm`, `/#/sit` and `/#/nts`. Misspelled legacy hash routes `/PPMCalulator` and `/NTSCalulator` redirect to the corresponding calculator. Legacy direct-path bookmarks require hosting support to reach `index.html`.

Publishing is separate from building. `npm run deploy` publishes to the configured GitHub Pages site; the UI/policy update does not deploy automatically.
