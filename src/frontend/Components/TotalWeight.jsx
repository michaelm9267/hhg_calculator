import React from 'react';
import { Button } from '@mui/material';
import { pounds } from './ShipmentEditor';

export default function TotalWeight({ totalWeights: result, hasShipments }) {
  return <aside className="panel summary" aria-label="Weight summary" aria-live="polite">
    <h2>Your weight summary</h2>
    <p className="panel-intro">All shipments share the allowance under the applicable orders.</p>
    {result.errors.length > 0 ? <div className="notice warn" role="status">{result.errors.map((error) => <p key={error}>{error}</p>)}</div> : <>
      <dl>
        <dt>Authorized HHG allowance</dt><dd>{pounds(result.maxWeightAllowance)} lb</dd>
        <dt>Recorded government shipment weight</dt><dd>{pounds(result.totalGovNet)} lb</dd>
        <dt>PPM net ticket weight</dt><dd>{pounds(result.totalPPMNet)} lb</dd>
        <dt>Government packing credit</dt><dd>−{pounds(result.packingCredit)} lb</dd>
        <dt>Member pro gear credit</dt><dd>−{pounds(result.memberProCredit)} lb</dd>
        <dt>Dependent spouse pro gear credit</dt><dd>−{pounds(result.spouseProCredit)} lb</dd>
        {result.secondaryProCredit > 0 && <><dt>Second member pro gear credit</dt><dd>−{pounds(result.secondaryProCredit)} lb</dd></>}
      </dl><hr /><dl>
        <dt>Weight charged to allowance</dt><dd className="primary-result">{pounds(result.chargeableWeight)} lb</dd>
        <dt>Remaining allowance</dt><dd>{pounds(result.remainingEntitlement)} lb</dd>
        {result.excessWeight > 0 && <><dt>Excess weight</dt><dd className="excess">{pounds(result.excessWeight)} lb</dd></>}
      </dl>
      {result.excessWeight > 0 && <p className="notice warn">You exceed the weight allowance. Your transportation office must determine any excess cost.</p>}
    </>}
    {result.warnings.map((warning) => <p className="notice warn" key={warning}>{warning}</p>)}
    <p className="notice">Recorded weights are preserved. This is a planning worksheet; official entitlement and payment are determined by your transportation office.</p>
    <div className="actions no-print"><Button variant="contained" disabled={!hasShipments || result.errors.length > 0} onClick={() => window.print()}>Print / save PDF</Button></div>
  </aside>;
}
