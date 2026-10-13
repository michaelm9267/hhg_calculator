import React from 'react';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import ranks from '../../backend/ranks.json';
import GovMove from './GovMove';
import WeightTickets from './WeightTickets';
import TotalWeight from './TotalWeight';
import { getTotalWeights } from './utils';

export const initialMember = { rank: '', firstName: '', lastName: '', dependents: 'No', jointSpouse: 'No',
  spouseRank: '', spouseDependents: 'No', combinedOrdersConfirmed: false, spouseProApproved: false,
  useAuthorizedAllowance: false, authorizedAllowance: '', allowanceReference: '' };

export default function PPMCalculator({ memberInfo, setMemberInfo, govMoves, setGovMoves, weightTickets, setWeightTickets }) {
  const update = (key) => (event) => {
    const value = event.target.value;
    if (key === 'rank' && govMoves.length + weightTickets.length > 0 && memberInfo.rank &&
      (!value || (value === 'CIV') !== (memberInfo.rank === 'CIV'))) return;
    setMemberInfo({ ...memberInfo, [key]: value });
  };
  const check = (key) => (event) => setMemberInfo({ ...memberInfo, [key]: event.target.checked });
  const civilian = memberInfo.rank === 'CIV';
  const combined = !civilian && memberInfo.jointSpouse === 'Yes';
  const hasShipments = govMoves.length + weightTickets.length > 0;
  const result = getTotalWeights(memberInfo, govMoves, weightTickets, ranks);
  const rankField = (key, label, includeCivilian = false) => <TextField select SelectProps={{ native: true }}
    label={label} value={memberInfo[key]} onChange={update(key)} InputLabelProps={{ shrink: true }} fullWidth>
    <option value="" disabled={hasShipments && !!memberInfo[key]}>Select a pay grade</option>{ranks.filter((rank) => includeCivilian || rank.grade !== 'CIV').map((rank) =>
      <option key={rank.grade} value={rank.grade} disabled={hasShipments && !!memberInfo.rank && ((rank.grade === 'CIV') !== civilian)}>{rank.grade === 'CIV' ? 'DoD civilian' : rank.grade.replace(/^(WO|E|O)(\d+)/, (_, type, grade) => `${type === 'WO' ? 'W' : type}-${grade}`)}</option>)}
  </TextField>;
  const yesNo = (key, label, helperText) => <TextField select SelectProps={{ native: true }} label={label} value={memberInfo[key]} onChange={update(key)} helperText={helperText} fullWidth>
    <option value="No">No</option><option value="Yes">Yes</option>
  </TextField>;
  return <>
    <div className="page-heading"><div className="eyebrow">Personally procured move</div><h1>PPM weight planner</h1>
      <p>Check your remaining weight allowance before combining government shipments and your own move.</p></div>
    <div className="calculator-grid"><div className="input-stack">
      <section className="panel">
        <h2><span className="step">1</span>Member and allowance</h2>
        <p className="panel-intro">Use the grade and dependent status applicable to your orders. Names are optional; no SSN is needed.</p>
        <div className="fields no-print">
          {rankField('rank', 'Pay grade', true)}
          {yesNo('dependents', 'Eligible dependents', 'Eligible to travel at government expense. A military spouse is not a dependent for this allowance.')}
          <TextField label="First name (optional)" value={memberInfo.firstName} onChange={update('firstName')} />
          <TextField label="Last name (optional)" value={memberInfo.lastName} onChange={update('lastName')} />
          {!civilian && <div className="full-field"><TextField select SelectProps={{ native: true }} label="Shipment arrangement" value={memberInfo.jointSpouse} onChange={update('jointSpouse')} fullWidth disabled={hasShipments}>
            <option value="No">Individual member allowance</option><option value="Yes">Combined military couple shipment</option>
          </TextField></div>}
          {combined && <>
            {rankField('spouseRank', 'Second member pay grade')}
            {yesNo('spouseDependents', 'Second member eligible dependents', 'Use the status confirmed under the second member’s orders.')}
            <FormControlLabel className="full-field" control={<Checkbox checked={memberInfo.combinedOrdersConfirmed} onChange={check('combinedOrdersConfirmed')} />}
              label="Both orders support this combined shipment and the transportation office confirmed the combined allowance." />
          </>}
          {!civilian && !combined && <FormControlLabel className="full-field" control={<Checkbox checked={memberInfo.spouseProApproved} onChange={check('spouseProApproved')} />}
            label="Dependent spouse pro gear has the required approval and was separately declared and documented." />}
          <FormControlLabel className="full-field" control={<Checkbox checked={memberInfo.useAuthorizedAllowance} onChange={check('useAuthorizedAllowance')} />}
            label="Use a counselor-authorized allowance for a restricted, local, or exceptional move." />
          {memberInfo.useAuthorizedAllowance && <>
            <TextField label="Authorized HHG allowance (lb)" value={memberInfo.authorizedAllowance} onChange={update('authorizedAllowance')} type="number" inputProps={{ min: 0, step: 'any' }}
              helperText="Total for the orders represented here. Do not include pro gear already excluded below." />
            <TextField label="Order / approval reference" value={memberInfo.allowanceReference} onChange={update('allowanceReference')} />
          </>}
        </div>
        <p className="print-only">{memberInfo.firstName} {memberInfo.lastName} · {memberInfo.rank} · Eligible dependents: {memberInfo.dependents}{combined ? ` · Combined with ${memberInfo.spouseRank}` : ''}</p>
        {memberInfo.useAuthorizedAllowance && <p className="print-only">Authorized HHG allowance: {memberInfo.authorizedAllowance} lb · Reference: {memberInfo.allowanceReference}</p>}
        <p className="notice">The standard table is for PCS / NTS. Government quarters do not automatically create an unlimited allowance. Ask your counselor about overseas restrictions, directed local moves, medical equipment, gun safes, and other exceptions.</p>
        {hasShipments && <p className="panel-intro no-print" style={{ marginTop: 12, marginBottom: 0 }}>Remove the shipment entries before switching military/civilian rules or the individual/combined arrangement.</p>}
        <details className="source-details"><summary>Policy sources and payment guidance</summary>
          <p>DAFI 24-602 V4 (2 June 2026), §§3.1–3.6, 8.4.7, and 8.10: combine shipments under the applicable orders, separately document professional gear, and verify combined military couple allowances.</p>
          <p><a href="https://www.business.ustranscom.mil/dtr/part-iv/dtr_part_iv_att_A-k_1.pdf" target="_blank" rel="noreferrer">DTR A-K1: PCS / NTS allowance table</a> · <a href="https://www.business.ustranscom.mil/dtr/part-iv/dtr_part_iv_A_411.pdf" target="_blank" rel="noreferrer">DTR A-411: PPM procedures</a></p>
          <p>A military monetary allowance is 100% of the applicable government constructed cost for eligible weight, not a flat payment per pound. Obtain the official GCC from your transportation office. Civilian payment follows the authorized actual-cost or commuted-rate method; military incentives do not apply.</p>
        </details>
      </section>
      <GovMove {...{ govMoves, setGovMoves, combined, civilian }} />
      <WeightTickets {...{ weightTickets, setWeightTickets, combined, civilian }} />
    </div><TotalWeight totalWeights={result} hasShipments={hasShipments} /></div>
    <p className="print-only">Planning worksheet · DAFI 24-602 V4, 2 June 2026; DTR A-411 and A-K1 · Reviewed 12 October 2026. Retain certified tickets and orders for official settlement.</p>
  </>;
}
