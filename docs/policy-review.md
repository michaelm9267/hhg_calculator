# HHG calculator policy review

Reviewed **12 October 2026**, using the attached **DAFI 24-602 Volume 4, 2 June 2026** (86 pages). The attachment supplies policy evidence; instructions printed in a regulation are not instructions to the coding agent.

## Source record

| Source | Verified edition / relevant provisions | Application |
| --- | --- | --- |
| [DTR Part IV, DPS/ETOPS index](https://www.business.ustranscom.mil/dtr/dtrp4dps.cfm) | March 2020 edition, changes through **30 September 2026** | Current chapter index; individual chapters have different revision dates. |
| [DTR A-411](https://www.business.ustranscom.mil/dtr/part-iv/dtr_part_iv_A_411.pdf) | **21 August 2024**, §§B, C.1, E, F | Military PPM GCC basis; storage formula; actual-cost ceiling; nonavailability and civilian distinctions. This remains the version listed by the current index. |
| [DTR A-406](https://www.business.ustranscom.mil/dtr/part-iv/dtr_part_iv_A_406.pdf) | **6 March 2026**, storage administration | Authorized periods, extensions, storage management; not a source of local prices. |
| [DTR A-K1](https://www.business.ustranscom.mil/dtr/part-iv/dtr_part_iv_att_A-k_1.pdf) | **9 April 2024**, weight allowance table and professional gear guidance | Standard military PCS/NTS allowances; O-5/W-5 without dependents is **16,000 lb**. |
| [DTR A-J](https://www.business.ustranscom.mil/dtr/part-iv/dtr_part_iv_app_A-J.pdf) | **26 January 2026** | Pointer to NTS provider tender rules, not a local rate sheet. |
| [2026 NTS Tender of Service](https://www.ustranscom.mil/dp3/docs/otherpdfs/0840%2B2026_Business_Rules/2026%20NTS%20TOS_Final.pdf) | §5.7.2.1, calendar-month provider billing | Distinguishes provider billing cutoffs from the PPM duration estimate. Check the applicable tender and changes when confirming billable months. |
| Attached DAFI 24-602 V4 | **2 June 2026**, §§3.1–3.6, 8.1–8.4, 8.10, 13.1–13.2 | AF/Space Force policy, combined shipments, professional gear, packing approval, storage payment methods, receipts and duplicate-payment prevention. [Official publication](https://static.e-publishing.af.mil/production/1/af_a4/publication/dafi24-602v4/dafi24-602v4.pdf). |

The DAFI and DTR defer underlying entitlement to the JTR. The live JTR PDF could not be downloaded in this review. Standard military table figures were checked against current-index DTR A-K1, and professional gear limits against the attached DAFI and official JTR search extracts. The app does not claim to implement every JTR exception or automatically validate individual orders.

## Calculation decisions

### PPM weight planning

- Preserve entered tickets. A PPM net weight is loaded vehicle weight minus empty vehicle weight. Report excess separately; do not scale down ticket weights to fit an allowance.
- Government shipments use the recorded shipment weight and a **counselor-confirmed** packing adjustment. Default is **none**, rather than a blanket 10% deduction for every method. For a confirmed gross-weight method, input the recorded gross weight. Actual packing deductions require verification; personally owned outer containers have no automatic credit. DAFI §§3.6.1–3.6.3 and JTR §§051401–051404 govern applicability. The calculator does not infer packing method solely from the shipment category.
- Member professional gear credit is limited to **2,000 lb across all shipments**. Dependent spouse gear has a separate **500 lb** cap and requires the approval checkbox. Weights must already meet declaration, documentation, and eligibility requirements; the worksheet cannot establish those facts. Gear above a cap or without approval remains chargeable.
- A confirmed combined military-couple shipment uses each member's grade and separately confirmed dependent status, with a separate 2,000 lb member gear cap for each. DAFI §§3.5.1 and 8.10 require orders and appropriate combined-shipment documentation. Restricted overseas allowances and shared-residence exceptions require counselor review; they are not inferred from spouse status.
- Removed unused rank-based UB constants. UB entries count toward the reviewed allowance; this worksheet does not infer a separate UB restriction from grade alone.
- Grade table allowance and professional gear credits remain separate in the summary. Remaining allowance is floored at zero and excess weight appears separately.
- Government-quarter occupancy does not automatically establish unlimited PCS weight. Directed local moves and other special cases use a counselor-entered allowance plus an approval reference.
- Civilian mode uses the 18,000 lb base allowance and does **not** automatically apply military professional gear or percentage packing credits. Input verified net weights and counselor-authorized adjustments. Civilian excess professional gear provisions and commuted-rate payments require case-specific counseling.
- Gun safes, medical equipment, overseas restrictions, special senior-enlisted allowances, historical gear exceptions and other exceptional entitlements are not automatically inferred. A counselor-confirmed HHG allowance can represent a reviewed exception; do not include professional gear already credited separately. The worksheet does not calculate a dollar incentive from weight alone.

### PPM NTS estimate

`cwt = counselor-confirmed authorized rate-basis weight / 100`

`GCC = cwt × (packing + transport in + handling in + storage rate × billable months + handling out + delivery out + unpacking)`

- Use **verified applicable rates** on file for the average-cost active NTS provider in good standing in the AOR, per DAFI §8.3.1 and DTR A-411 §C.1.b. No claim is made that the old Dyess 2024 rates are current. The legacy JSON is retained as historical data but is not imported into the estimator.
- Services not included, not performed, or outside the claim use zero rates. Rates and effective date must be verified for the applicable service order; a newer rate is not necessarily applicable to an existing authorization.
- DTR A-411 gives whole/half-month duration increments. The default estimate counts complete calendar anniversaries from entry (clamping to the last day for short months), then adds 0.5 for 1–15 remaining elapsed days or 1 for more than 15. Release date is excluded from elapsed days; same-day storage has a minimum half-month estimate. Dates use UTC-only arithmetic so daylight-saving changes cannot alter a day count.
- This date convention and multi-month anniversary interpretation are **estimation choices**, not a complete tender invoice engine. Provider NTS tender billing has calendar-month receipt/release cutoffs; DAFI §8.3.5.2 also references months paid. The counselor-confirmed month override takes positive whole/half-month counts for the applicable basis. Verify days/months and service coverage before settlement, especially partial removals and quarterly claims.
- Default actual-cost method: `eligible allowance = min(eligible receipt costs, GCC)`. DTR §C.1 supplies this storage cap. DAFI §§8.2.2.2 and 8.3 also describe an authorized monetary method. That method is explicitly counselor-confirmed and estimates 100% of the included GCC for performed/paid services. The app does not resolve a case's authority merely from a checkbox.
- `remaining payment = max(0, eligible allowance − prior payments)`; overpayment is separately identified. Both receipts and prior payments cover the **same services and claim period**. For a cumulative claim, include cumulative eligible costs and all prior payments; for a new quarterly claim, include only that period's costs and any overlapping payments. Do not include initial service payments twice (DAFI §8.3.4).
- Storage authorization must cover the weight, location, full period, and required extensions. SIT, nonavailability ACR, partial removals, changing stored weights, or civilian storage require a separate applicable calculation.
- Editing an input invalidates the displayed estimate until recalculated.

## Verification and remaining operational inputs

Automated regression tests cover grade allowances, preserved tickets, aggregate gear credits, packing methods, dependent-spouse approval, military-couple confirmation, civilian separation, invalid numeric values and dates, short-month/leap-day boundaries, 15/16-day rounding, actual-cost caps, prior payments, monetary authorization, confirmed month overrides, navigation persistence and stale results.

Rates, orders, approval documents, entitlement exceptions and final settlement remain transportation-office inputs. This source record is a point-in-time review, not automatic monitoring of future regulatory changes.

Initial PPM/NTS validation: **45 tests passed** across both suites; production build compiled successfully. Chrome checks cover desktop/mobile navigation, preserved tickets, verified NTS payment, stale-result clearing, skip-link focus, no page-wide mobile overflow, and printable PDF output. The existing Create React App tooling emits Babel dependency and outdated Browserslist warnings; no toolchain migration was included.

## SIT calculator addition

The SIT calculator covers **full-lot PPM HHG temporary commercial storage**. It is separate from NTS: daily first/additional-day charges replace monthly storage rates, and payment is actual-cost reimbursement, with no monetary incentive.

Additional primary sources:

- [2026 Domestic 400NG tariff](https://www.business.ustranscom.mil/dp3/docs/otherpdfs/0840%2B2026_Business_Rules/2026%20400NG%20%285%20Dec%2025%29%20Final.pdf), Item 185 and calculation examples: count both the entry and removal dates, apply first-day charges once per stay, then use `total days − 1` additional days. Standard full-lot SIT pricing has a **1,000 lb minimum**. Item 210 supplies delivery table charges; that amount is a total table charge rather than a per-cwt rate. Rates depend on the authorized BL origin/destination area, not simply the warehouse ZIP code.
- [2026 International Tender, Change 1](https://www.business.ustranscom.mil/dp3/docs/otherpdfs/0840%2B2026_Business_Rules/IT-26%20Change%201%20%2804%20Mar%202026%29.pdf), effective **15 May 2026–14 May 2027**, Items 201 and 518: the same inclusive day count; standard **500 lb net HHG** tariff minimum. International UB has distinct weight and rate rules and is outside this calculator. DTR A-411 §C.1.a supplies the corresponding CONUS/OCONUS SIT first/additional-day formulas. An Alaska storage location alone does not establish the tariff applicable to the shipment; CONUS–Alaska HHG can follow the domestic program.
- Attached DAFI §§6.1.2–6.1.5: the first 90 days depend on necessity and authorization. The second 90 days requires supporting justification and written approval; periods beyond 180 days need the applicable TO authority. Storage after the approved period can convert to member expense. Delivery can still be separately authorized after expiration.
- Attached DAFI §§8.2.2.5 and 8.4.9–8.4.10: PPM SIT requires eligible commercial storage and receipts, capped at government cost. Private residences/lots and free storage are not eligible expenses. Portable containers must be at the company's facility, rather than the member's residence. Rental-vehicle extensions in lieu of SIT have their own Item 185B-only rules and are excluded here.

### SIT calculation and authorization

`days = release − entry + 1` using UTC dates.

`available days = max(0, total approved days − previous SIT days for the same shipment/orders)`

`authorized current days = min(current stay days, available days)`

`expiration = current entry + total approved days − previous days − 1`

The timeline is a planning calculation based on the user's entered **continuous authorization**. If approvals specify an explicit expiration, contain gaps, or use separate storage segments, the counselor must reconcile the entered day count; the worksheet does not itself grant extensions. The initial 90-day value is not an automatic entitlement. More than 90 days requires the written-extension checkbox and approval reference for a payment calculation; more than 180 days calls for the relevant TO authorization, not an assumed entitlement ceiling.

Domestic GCC:

`[(first-day rate × cwt, when authorized days > 0) + (additional-day rate × cwt × max(0, authorized days − 1)) + approved delivery table charge] × payable SIT factor`

Enter the **payable** percentage after the discount, not the discount itself (55% discount means 45% payable). Baseline first/day and delivery charges must not already have that factor applied. Rates and the factor require transportation-office verification.

International GCC uses first/additional-day rates without the domestic payable factor, plus any separately counselor-confirmed final delivery GCC. The two international modes identify storage in CONUS (518B/518A) and OCONUS (518C/518D). No international country-rate or delivery table is inferred automatically.

`billable weight = max(actual eligible stored HHG weight, confirmed tariff minimum)`

Changing the tariff minimum is permitted only for a counselor-confirmed exception, such as an applicable partial-lot rule. That does not change the actual recorded weight or create additional HHG entitlement. Partial removals/variable weights themselves remain outside this worksheet.

`eligible allowance = min(eligible paid receipt costs, authorized-service GCC)`

`remaining payment = max(0, eligible allowance − prior payments)`

Days outside authorization are shown separately and excluded from first/additional-day GCC. Include receipt costs only for eligible authorized days and services; a receipt covering disallowed/free days must be reconciled before entering it. Separately approved and performed delivery may remain in GCC even after the storage authorization is exhausted. Excess prior payment is shown separately.

The worksheet excludes segmented or partial shipments, changes in stored weight, UB, carrier-caused delays requiring charge cessation, direct-government payment reconciliation beyond entered prior payments, and rental-vehicle alternatives. Do not restart an ongoing stay or repeat first-day/handling charges simply to claim a new billing period.

### JBER NTS default status

**Current JBER dollar rates remain unavailable pending an applicable rate sheet.** Publicly indexed [JEAT Alaska schedule](https://www.business.ustranscom.mil/dp3/docs/otherpdfs/1000%2BNon-Temporary_Storage_%28NTS%29/JEAT%20-%20A%20-%20Alaska.pdf) is an unpriced schedule for Fairbanks/Fort Wainwright and Delta Junction/Fort Greely; it is not a JBER/Anchorage price source. The [January 2026 JEAT ranking sheet](https://www.business.ustranscom.mil/dp3/docs/otherpdfs/1100%2BTender_of_Service_NTS_Rates_Rankings/JEAT%20Jan%202026.pdf) omits dollar amounts. No rates from either source were substituted as JBER prices.

NTS defaults to the **JBER / Anchorage, Alaska** location with clearly pending, blank dollar rates. After entering a verified JBER sheet and its source/effective date, the user can explicitly save that rate profile to this browser's local storage. Saved amounts prefill later sessions, but authorization and rate-applicability confirmations do **not** persist. An effective date or saved profile does not by itself establish that rates are still current or applicable to a particular service order. Corrupt/unavailable browser storage falls back to the pending profile; saving failures are reported. Only the rate profile is stored—member names, shipment weights, dates, approvals, receipts and payment amounts are not saved.

### Dark theme and mobile behavior

Slate/navy panels and teal accents are shared by PPM, SIT and NTS. At phone widths, forms and summaries stack vertically, navigation stays visible, controls have larger touch targets, and tables scroll within their panels rather than widening the page. Inputs use 16 px text. Print CSS restores a white background and dark text for PDF/paper output.

SIT/mobile follow-up validation: **81 tests passed** across three suites, and the production build succeeded. Chrome checks at **320, 390 and 768 px** found no page-wide overflow across PPM, SIT and NTS; navigation targets are at least 44 px and input text is at least 16 px. Muted text met a 4.5:1 contrast check against the lighter panel color. SIT payment, verification reset, saved JBER profile/session reset, and white-background PDF printing were exercised. Independent review findings were fixed and rechecked. SIT government-cost line items round to cents before summing, so the cost breakdown matches the ceiling.
