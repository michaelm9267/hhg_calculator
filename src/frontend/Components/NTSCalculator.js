import React, { useState } from 'react';
import { Alert, Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { calculateNTS, NTS_SERVICES } from './utils';
import { pounds } from './ShipmentEditor';
import { JBER_LOCATION, loadJBERDefaults, saveJBERDefaults } from './jberRateProfile';

export const initialNTS = {
  weight: '', start: '', end: '', location: JBER_LOCATION, profileStatus: 'pending', rateSource: '', rateDate: '',
  rates: { pack: '', drayIn: '', handleIn: '', storage: '', handleOut: '', drayOut: '', unpack: '' },
  ratesVerified: false, authorized: false, method: 'actual', actualCost: '', priorPayment: '0',
  monetaryAuthorized: false, useConfirmedMonths: false, confirmedMonths: '', servicesPerformed: false,
};
export const getInitialNTS = () => ({ ...initialNTS, rates: { ...initialNTS.rates }, ...loadJBERDefaults() });
const money = (value) => Number(value).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export default function NTSCalculator({ form, setForm }) {
  const [calculation, setCalculation] = useState(null);
  const [error, setError] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const signature = JSON.stringify(form);
  const result = calculation?.signature === signature ? calculation.result : null;
  const update = (key) => (event) => {
    const isRateField = ['location', 'rateSource', 'rateDate'].includes(key);
    setForm({ ...form, [key]: event.target.value, ...(isRateField ? { profileStatus: 'custom', ratesVerified: false } : {}) });
    setError(''); if (isRateField) setProfileMessage('');
  };
  const check = (key) => (event) => { setForm({ ...form, [key]: event.target.checked }); setError(''); };
  const saveDefaults = () => {
    try {
      saveJBERDefaults(form);
      setForm({ ...form, profileStatus: 'saved' });
      setProfileMessage('JBER rate defaults saved in this browser. Confirm applicability again for each storage authorization.');
      setError('');
    } catch (failure) { setProfileMessage(''); setError(failure.message); }
  };
  const calculate = (event) => {
    event.preventDefault();
    try { setCalculation({ result: calculateNTS(form), signature }); setError(''); }
    catch (failure) { setCalculation(null); setError(failure.message); }
  };
  const input = (key, label, type = 'text', helperText) => <TextField label={label} type={type} value={form[key]} onChange={update(key)} fullWidth
    InputLabelProps={type === 'date' ? { shrink: true } : undefined} inputProps={type === 'number' ? { min: 0, step: 'any' } : undefined} helperText={helperText} />;
  return <>
    <div className="page-heading"><div className="eyebrow">Non-temporary storage</div><h1>NTS cost estimator</h1>
      <p>Build a storage cost ceiling from verified local rates, then estimate payment under your authorized method.</p></div>
    <form className="calculator-grid" onSubmit={calculate} noValidate><div className="input-stack">
      <section className="panel">
        <h2><span className="step">1</span>Storage details</h2>
        <p className="panel-intro">Use the authorized weight, location, and period confirmed by your transportation office.</p>
        <div className="fields no-print">
          {input('weight', 'Authorized storage weight (lb)', 'number', 'Use the counselor-confirmed weight for the rate calculation, within your remaining entitlement.')}
          {input('location', 'Storage location / rate area')}
          {input('start', 'Storage entry date', 'date')}
          {input('end', 'Storage release date', 'date')}
          <FormControlLabel className="full-field" control={<Checkbox checked={form.useConfirmedMonths} onChange={check('useConfirmedMonths')} />}
            label="Use counselor-confirmed billable months instead of the PPM duration estimate." />
          {form.useConfirmedMonths && input('confirmedMonths', 'Confirmed billable months', 'number', 'Whole or half months under the applicable billing basis. Retain counselor verification.')}
          <FormControlLabel className="full-field" control={<Checkbox checked={form.authorized} onChange={check('authorized')} />}
            label="Transportation office authorization covers this location, weight, and entire storage period, including any extension." />
        </div>
        <p className="notice">The default PPM estimate uses complete months from entry, then ½ month for 1–15 remaining days or one month for more than 15. Elapsed days exclude the release date; same-day storage uses ½ month. Verify billable months before settlement.</p>
        <p className="print-only">Location: {form.location || 'Not specified'} · Authorized weight: {pounds(form.weight)} lb · Entry: {form.start} · Release: {form.end}</p>
      </section>
      <section className="panel">
        <h2><span className="step">2</span>JBER rate defaults</h2>
        <p className="panel-intro">Enter the rates on file for the average-cost active NTS provider in good standing in your area. All rates are dollars per 100 pounds (cwt); storage is per cwt per month.</p>
        <p className="notice warn no-print" style={{ marginTop: 0, marginBottom: 20 }}>{form.profileStatus === 'pending' ? 'A current JBER rate sheet is needed to populate dollar defaults. Enter verified JBER rates below, then save them for this browser.' : form.profileStatus === 'saved' ? 'Saved JBER rates are loaded for convenience. Verify the source, effective date, and applicability to this service order.' : 'Custom rates entered. Save verified JBER rates below to use them as defaults next time.'}</p>
        <div className="fields no-print">
          {input('rateSource', 'Rate source / tender reference')}
          {input('rateDate', 'Rate sheet effective date', 'date')}
          {NTS_SERVICES.map(([key, label]) => <TextField key={key} label={`${label} ($/cwt${key === 'storage' ? '/month' : ''})`} type="number"
            value={form.rates[key]} onChange={(event) => { setForm({ ...form, rates: { ...form.rates, [key]: event.target.value }, profileStatus: 'custom', ratesVerified: false }); setError(''); setProfileMessage(''); }}
            inputProps={{ min: 0, step: '0.01' }} helperText="Enter 0 for a service not included or not performed." />)}
          <FormControlLabel className="full-field" control={<Checkbox checked={form.ratesVerified} onChange={check('ratesVerified')} />}
            label="The transportation office verified these rates apply to this storage authorization." />
        </div>
        <div className="actions no-print"><Button variant="outlined" onClick={saveDefaults}>Save as JBER defaults</Button></div>
        {profileMessage && <p className="notice no-print" role="status">{profileMessage}</p>}
        <p className="print-only">Rate source: {form.rateSource} · Effective date: {form.rateDate}</p>
      </section>
      <section className="panel no-print">
        <h2><span className="step">3</span>Payment basis</h2>
        <p className="panel-intro">Account for services performed and payments already received. Do not claim the same services twice.</p>
        <div className="fields">
          <TextField className="full-field" select SelectProps={{ native: true }} label="Authorized payment method" value={form.method} onChange={update('method')}>
            <option value="actual">Actual eligible costs, capped at government cost</option>
            <option value="monetary">DAF monetary allowance — counselor authorization required</option>
          </TextField>
          {form.method === 'actual' && input('actualCost', 'Eligible paid receipt costs ($)', 'number', 'Total eligible costs for the services and period in this estimate, before prior payments.')}
          {input('priorPayment', 'Prior payments for these services ($)', 'number', 'Include prior reimbursements and advances to avoid duplicate payment.')}
          {form.method === 'monetary' && <FormControlLabel className="full-field" control={<Checkbox checked={form.monetaryAuthorized} onChange={check('monetaryAuthorized')} />}
            label="My counselor authorized the DAF monetary allowance method for this case under DAFI §§8.2.2.2 and 8.3." />}
          <FormControlLabel className="full-field" control={<Checkbox checked={form.servicesPerformed} onChange={check('servicesPerformed')} />}
            label="Included services have been performed or paid for; future or excluded services have a zero rate." />
        </div>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <div className="actions"><Button type="submit" variant="contained">Calculate storage estimate</Button></div>
        <details className="source-details"><summary>Calculation rules and policy sources</summary>
          <p><a href="https://www.business.ustranscom.mil/dtr/part-iv/dtr_part_iv_A_411.pdf" target="_blank" rel="noreferrer">DTR A-411, §C.1.b</a> supplies the PPM NTS formula and whole/half-month duration increments. §C.1 limits storage reimbursement to eligible actual costs not exceeding government cost.</p>
          <p>DAFI 24-602 V4 (2 June 2026), §§8.2.2 and 8.3, describes actual-cost and authorized monetary methods, average-provider rates, paid receipts, and preventing duplicate initial-service payments.</p>
          <p><a href="https://www.business.ustranscom.mil/dtr/part-iv/dtr_part_iv_A_406.pdf" target="_blank" rel="noreferrer">DTR A-406 (6 March 2026)</a> governs storage management. Provider tender billing uses calendar-month entry/release cutoffs and can differ from this PPM duration estimate. Use confirmed billable months when directed by your counselor.</p>
          <p>This estimator covers PPM NTS. SIT and government-nonavailability actual-cost cases require separate applicable authorization and calculation.</p>
        </details>
      </section>
    </div><aside className="panel summary" aria-live="polite">
      <h2>Storage estimate</h2>
      {result ? <div aria-label="Storage cost result">
        <dl><dt>Elapsed storage time</dt><dd>{pounds(result.days)} days</dd><dt>Billable storage</dt><dd>{pounds(result.months)} months</dd><dt>Weight in hundredweight</dt><dd>{pounds(result.cwt)} cwt</dd></dl>
        <div className="table-scroll"><table className="data-table" aria-label="Storage cost breakdown"><thead><tr><th>Service</th><th>Rate</th><th className="money">Cost</th></tr></thead>
          <tbody>{result.items.map((item) => <tr key={item.key}><td>{item.label}</td><td>{money(item.rate)}</td><td className="money">{money(item.total)}</td></tr>)}</tbody></table></div>
        <dl><dt>Government cost ceiling</dt><dd>{money(result.ceiling)}</dd>
          <dt>{form.method === 'actual' ? 'Eligible actual costs, capped' : 'Authorized monetary allowance'}</dt><dd>{money(result.allowance)}</dd>
          <dt>Less prior payments</dt><dd>−{money(form.priorPayment)}</dd></dl><hr />
        <dl><dt>Estimated remaining payment</dt><dd className="primary-result">{money(result.reimbursement)}</dd></dl>
        {result.overpaid > 0 && <p className="notice warn">Prior payments exceed this estimate by {money(result.overpaid)}. Ask your transportation office about settlement.</p>}
        <div className="actions no-print"><Button variant="outlined" onClick={() => window.print()}>Print / save PDF</Button></div>
        <p className="print-only">Method: {form.method === 'actual' ? 'Actual eligible costs, capped at GCC' : 'Counselor-authorized DAF monetary allowance'}. {form.useConfirmedMonths ? 'Counselor-confirmed billable months used.' : 'PPM duration estimate used.'}</p>
      </div> : <p className="notice">Enter storage details, verified rates, and payment information, then calculate. Results clear when inputs change.</p>}
      <p className="notice">This is an estimate for counselor review. Authorization and supporting receipts determine final settlement.</p>
    </aside></form>
    <p className="print-only">Planning worksheet · DAFI 24-602 V4, 2 June 2026; DTR A-411 and A-406 · Reviewed 12 October 2026.</p>
  </>;
}
