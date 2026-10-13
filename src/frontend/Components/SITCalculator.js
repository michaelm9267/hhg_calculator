import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { calculateSIT, getSITPeriod } from './utils';
import { pounds } from './ShipmentEditor';

export const initialSIT = {
  start: '', end: '', location: 'JBER / Anchorage, Alaska', approvedDays: '90', priorDays: '0',
  weight: '', basis: 'domestic', minimumWeight: '1000', firstDayRate: '', dailyRate: '',
  payablePercent: '', deliveryCharge: '0', deliveryAuthorized: false,
  authorized: false, extensionApproved: false, approvalReference: '', facilityEligible: false,
  ratesVerified: false, rateSource: '', rateDate: '', servicesPerformed: false, actualCost: '', priorPayment: '0',
};
const money = (amount) => Number(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const dateLabel = (value) => new Date(`${value}T00:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' });

export default function SITCalculator({ form, setForm }) {
  const [calculation, setCalculation] = useState(null);
  const [error, setError] = useState('');
  const resultRef = useRef(null);
  const signature = JSON.stringify(form);
  const result = calculation?.signature === signature ? calculation.result : null;
  let period = null;
  try { period = getSITPeriod(form); } catch { /* Timeline appears after valid dates and day counts. */ }
  const domestic = form.basis === 'domestic';
  const update = (key) => (event) => {
    const value = event.target.value;
    const rateFields = ['basis', 'firstDayRate', 'dailyRate', 'minimumWeight', 'payablePercent', 'deliveryCharge', 'rateSource', 'rateDate', 'location'];
    setForm({ ...form, [key]: value,
      ...(key === 'basis' ? { minimumWeight: value === 'domestic' ? '1000' : '500' } : {}),
      ...(rateFields.includes(key) ? { ratesVerified: false } : {}),
      ...(['basis', 'deliveryCharge', 'location'].includes(key) ? { deliveryAuthorized: false } : {}),
    });
    setError('');
  };
  const check = (key) => (event) => { setForm({ ...form, [key]: event.target.checked }); setError(''); };
  const input = (key, label, type = 'text', helperText) => <TextField label={label} type={type} value={form[key]} onChange={update(key)} fullWidth
    InputLabelProps={type === 'date' ? { shrink: true } : undefined} inputProps={type === 'number' ? { min: 0, step: ['approvedDays', 'priorDays'].includes(key) ? 1 : 'any' } : undefined} helperText={helperText} />;
  const checkbox = (key, label) => <FormControlLabel className="full-field" control={<Checkbox checked={form[key]} onChange={check(key)} />} label={label} />;
  const calculate = (event) => {
    event.preventDefault();
    try { setCalculation({ result: calculateSIT(form), signature }); setError(''); }
    catch (failure) { setCalculation(null); setError(failure.message); }
  };
  useEffect(() => {
    if (calculation && resultRef.current) {
      resultRef.current.focus({ preventScroll: true });
      resultRef.current.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
    }
  }, [calculation]);
  return <>
    <div className="page-heading"><div className="eyebrow">Storage in transit</div><h1>SIT cost calculator</h1>
      <p>Plan temporary storage dates and estimate eligible reimbursement for a personally procured HHG move.</p></div>
    <form className="calculator-grid" onSubmit={calculate} noValidate><div className="input-stack">
      <section className="panel">
        <h2><span className="step">1</span>Dates and authorization</h2>
        <p className="panel-intro">SIT requires prior approval. The first 90 days are a planning starting point, not an automatic entitlement.</p>
        <div className="fields no-print">
          {input('start', 'SIT entry date', 'date')}{input('end', 'SIT release date', 'date')}
          {input('approvedDays', 'Total authorized SIT days', 'number', 'Include only approved extensions. More than 180 days requires the applicable TO approval.')}
          {input('priorDays', 'SIT days already used', 'number', 'Earlier storage for this same shipment/order; a new entry does not restart the allowance.')}
          {input('weight', 'Eligible storage weight (lb)', 'number', 'Actual net HHG weight within your remaining entitlement, confirmed by your counselor.')}
          {input('location', 'Authorized storage location')}
          {checkbox('authorized', 'Prior SIT authorization covers the location, eligible weight, and approved number of days entered here.')}
          {Number(form.approvedDays) > 90 && <>
            {checkbox('extensionApproved', 'Written extension approval was obtained before expiration and applies to the total days entered here.')}
            {input('approvalReference', 'DD Form 1857 / extension reference')}
          </>}
          {checkbox('facilityEligible', 'Storage is at an eligible commercial facility; portable containers remain at the company’s storage center.')}
        </div>
        <p className="notice">Both entry and release dates count. Private residences, garages, private lots, and free storage periods are not reimbursable commercial SIT. Enter only eligible paid costs below.</p>
        <p className="print-only">Location: {form.location} · Entry: {form.start} · Release: {form.end} · Authorized days: {form.approvedDays} · Previously used: {form.priorDays} · Eligible weight: {pounds(form.weight)} lb</p>
        {Number(form.approvedDays) > 90 && <p className="print-only">Extension reference: {form.approvalReference}</p>}
      </section>
      <section className="panel">
        <h2><span className="step">2</span>Applicable SIT rates</h2>
        <p className="panel-intro">SIT uses daily rates, not NTS monthly rates. Your counselor determines the tariff, rate area, minimum weight, and any payable factor.</p>
        <div className="fields no-print">
          <TextField className="full-field" select SelectProps={{ native: true }} label="SIT rate basis" value={form.basis} onChange={update('basis')}>
            <option value="domestic">Domestic HHG / 400NG</option>
            <option value="international-conus">International / CONUS SIT</option>
            <option value="international-oconus">International / OCONUS SIT</option>
          </TextField>
          {input('firstDayRate', 'First day + handling ($/cwt)', 'number', domestic ? 'Undiscounted Item 185A baseline rate.' : form.basis === 'international-conus' ? 'Item 518B rate.' : 'Item 518C rate.')}
          {input('dailyRate', 'Additional day ($/cwt/day)', 'number', domestic ? 'Undiscounted Item 185B baseline rate.' : form.basis === 'international-conus' ? 'Item 518A rate.' : 'Item 518D rate.')}
          {input('minimumWeight', 'Tariff minimum weight (lb)', 'number', domestic ? 'Standard full-lot 400NG SIT minimum: 1,000 lb. Change only for a confirmed exception.' : 'Standard international HHG minimum: 500 lb. Change only as confirmed by your counselor.')}
          {domestic && input('payablePercent', 'Payable SIT factor (%)', 'number', 'Enter the percentage paid after the discount: a 55% discount means 45% payable. Applied once to baseline charges.')}
          {input('deliveryCharge', domestic ? 'Approved delivery table charge ($)' : 'Separately approved delivery GCC ($)', 'number', domestic ? 'Total Item 210 table charge before the SIT factor, not a per-cwt rate. Use 0 if not included.' : 'Final counselor-confirmed amount, after any applicable adjustments. Use 0 if not included.')}
          {Number(form.deliveryCharge) > 0 && checkbox('deliveryAuthorized', 'The delivery service is separately authorized, performed, and documented by an eligible receipt.')}
          {input('rateSource', 'Rate source / counselor quote')}{input('rateDate', 'Rate effective date', 'date')}
          {checkbox('ratesVerified', 'The transportation office verified the SIT rates and billing basis for this shipment and rate area.')}
        </div>
        <p className="notice">JBER’s location does not automatically select international rates. CONUS–Alaska HHG can use the domestic tariff. Rates follow the shipment’s authorized origin/destination rate area, not simply the warehouse ZIP code.</p>
        <p className="print-only">Basis: {form.basis} · Rate source: {form.rateSource} · Effective: {form.rateDate} · Minimum: {form.minimumWeight} lb · Domestic payable factor: {domestic ? `${form.payablePercent}%` : 'Not applied'}</p>
      </section>
      <section className="panel no-print">
        <h2><span className="step">3</span>Eligible costs and payments</h2>
        <p className="panel-intro">SIT is actual-cost reimbursement, capped at the applicable government cost. It has no monetary incentive.</p>
        <div className="fields">
          {input('actualCost', 'Eligible paid receipt costs ($)', 'number', 'Only authorized days and included services. Exclude free days, private storage, and costs already paid directly by government.')}
          {input('priorPayment', 'Prior SIT payments ($)', 'number', 'Payments or advances for the same eligible costs and period. Use 0 when none.')}
          {checkbox('servicesPerformed', 'Included services are performed or paid for and supported by eligible receipts.')}
        </div>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <div className="actions"><Button type="submit" variant="contained">Calculate SIT reimbursement</Button></div>
        <details className="source-details"><summary>Policy sources and calculation limits</summary>
          <p>DAFI 24-602 V4 (2 June 2026), §§6.1.2–6.1.5, 8.2.2.5, 8.4.9–8.4.10: necessity, prior approval, written extensions, commercial storage, receipts, and actual-cost reimbursement.</p>
          <p><a href="https://www.business.ustranscom.mil/dtr/part-iv/dtr_part_iv_A_411.pdf" target="_blank" rel="noreferrer">DTR A-411 §C.1.a</a> supplies domestic/international SIT formulas. <a href="https://www.business.ustranscom.mil/dp3/docs/otherpdfs/0840%2B2026_Business_Rules/2026%20400NG%20%285%20Dec%2025%29%20Final.pdf" target="_blank" rel="noreferrer">2026 400NG Item 185</a> counts both storage dates; additional days are total days minus one.</p>
          <p>This full-lot HHG worksheet excludes partial removals, varying weights, UB-specific rates, rental-vehicle extensions in lieu of SIT, and carrier delays requiring charge cessation. Get a separate counselor calculation for those cases. Additional delivery eligibility after storage expiration requires counselor confirmation.</p>
        </details>
      </section>
    </div><aside className="panel summary" aria-label="SIT summary" aria-live="polite">
      <h2>Your SIT summary</h2>
      {period ? <>
        <dl><dt>Storage days, including both dates</dt><dd>{pounds(period.days)} days</dd>
          <dt>Authorized days in this stay</dt><dd>{pounds(period.authorizedDays)} days</dd>
          <dt>Expiration based on entered approval</dt><dd className="date-result">{dateLabel(period.expiration)}</dd>
          {period.unauthorizedDays > 0 && <><dt>Days outside authorization</dt><dd className="excess">{pounds(period.unauthorizedDays)} days</dd></>}
        </dl>
        {period.unauthorizedDays > 0 && <p className="notice warn">Storage after the approved period can become your expense. Those storage days are excluded from the GCC estimate.</p>}
      </> : <p className="notice">Enter valid dates and authorization days to see the storage timeline.</p>}
      <hr />
      {result ? <div aria-label="SIT reimbursement result" ref={resultRef} tabIndex={-1}>
        <p className="panel-intro">{pounds(result.weight)} lb stored · {pounds(result.billableWeight)} lb used for tariff pricing · {pounds(result.additionalDays)} authorized additional days</p>
        <div className="table-scroll"><table className="data-table" aria-label="SIT cost breakdown">
          <thead><tr><th>Service</th><th className="money">Government cost</th></tr></thead>
          <tbody><tr><td>First day / handling</td><td className="money">{money(result.firstDayCost)}</td></tr>
            <tr><td>Additional days</td><td className="money">{money(result.additionalDayCost)}</td></tr>
            <tr><td>Approved delivery</td><td className="money">{money(result.deliveryCost)}</td></tr></tbody>
        </table></div>
        <dl><dt>Government cost ceiling</dt><dd>{money(result.ceiling)}</dd>
          <dt>Eligible actual costs, capped</dt><dd>{money(result.allowance)}</dd>
          <dt>Less prior payments</dt><dd>−{money(form.priorPayment)}</dd>
          <dt>Estimated remaining reimbursement</dt><dd className="primary-result">{money(result.reimbursement)}</dd></dl>
        {result.overpaid > 0 && <p className="notice warn">Prior payments exceed eligible costs by {money(result.overpaid)}. Review settlement with your transportation office.</p>}
        <div className="actions no-print"><Button variant="outlined" onClick={() => window.print()}>Print / save PDF</Button></div>
      </div> : <p className="notice">Enter verified rates and eligible costs, then calculate reimbursement. Any edit clears the payment estimate.</p>}
      <p className="notice">The timeline uses your entered approval period. Your transportation office determines authorization, rate applicability, and final settlement.</p>
    </aside></form>
    <p className="print-only">PPM SIT planning worksheet · DAFI 24-602 V4, 2 June 2026; DTR A-411 and A-406; 2026 tariff rules · Reviewed 12 October 2026.</p>
  </>;
}
