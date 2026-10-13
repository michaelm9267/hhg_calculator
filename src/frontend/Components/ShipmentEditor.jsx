import React, { useState } from 'react';
import { Alert, Button, TextField } from '@mui/material';
import { validateShipment } from './utils';

const emptyShipment = { moveType: 'HHG', netWeight: '', grossWeight: '', tareWeight: '', pbpe: '', spousePbpe: '', secondaryPbpe: '', packingMethod: 'none', packingWeight: '' };
export const pounds = (value) => Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 });

export default function ShipmentEditor({ rows, setRows, government = false, combined = false, civilian = false }) {
  const [entry, setEntry] = useState(emptyShipment);
  const [error, setError] = useState('');
  const packingMethod = civilian && ['10', '20', '50'].includes(entry.packingMethod) ? 'none' : entry.packingMethod;
  const title = government ? 'Government shipments' : 'PPM weight tickets';
  const update = (key) => (event) => { setEntry({ ...entry, [key]: event.target.value }); setError(''); };
  const field = (key, label, helperText) => <TextField label={label} value={entry[key]} onChange={update(key)} type="number" fullWidth
    inputProps={{ min: 0, step: 'any' }} helperText={helperText} />;
  const add = (event) => {
    event.preventDefault();
    const shipment = { ...entry, packingMethod, ...(civilian ? { pbpe: 0, spousePbpe: 0, secondaryPbpe: 0 } : {}),
      ...(combined ? { spousePbpe: 0 } : { secondaryPbpe: 0 }) };
    const message = validateShipment(shipment, government);
    if (message) { setError(message); return; }
    setRows([...rows, shipment]);
    setEntry(emptyShipment);
    setError('');
  };
  return <section className="panel">
    <h2><span className="step">{government ? '2' : '3'}</span>{title}</h2>
    <p className="panel-intro">{government ? 'Include HHG, unaccompanied baggage, and NTS under these orders. Choose the packing adjustment confirmed by your counselor.' : 'Enter each pair of certified loaded and empty tickets. Net weight is loaded minus empty; PPM receives no automatic packing deduction.'}</p>
    <form className="no-print" onSubmit={add} noValidate>
      <div className="fields">
        {government ? <>
          <TextField select SelectProps={{ native: true }} label="Shipment type" value={entry.moveType} onChange={update('moveType')}>
            <option value="HHG">Household goods</option><option value="UB">Unaccompanied baggage</option>
            <option value="NTS">Non-temporary storage</option><option value="LOCAL">Local move</option><option value="DPM">Direct procurement</option>
          </TextField>
          {field('netWeight', 'Recorded shipment weight (lb)', 'Use TSP net weight. For a confirmed 50% gross adjustment, use recorded gross weight.')}
          <TextField select SelectProps={{ native: true }} label="Confirmed packing adjustment" value={packingMethod} onChange={update('packingMethod')}
            helperText="No adjustment for personally owned outer containers. Actual packing weight requires verification.">
            <option value="none">None / already adjusted</option>
            {!civilian && <option value="10">10% of recorded net weight</option>}
            {!civilian && <option value="20">20% of recorded net weight (DPM)</option>}
            {!civilian && <option value="50">50% of recorded gross weight (eligible UB/DPM)</option>}
            <option value="actual">Verified actual packing weight</option>
          </TextField>
          {entry.packingMethod === 'actual' && field('packingWeight', 'Verified packing weight (lb)', 'Transportation office approval required.')}
        </> : <>
          {field('grossWeight', 'Loaded vehicle weight (lb)', 'Gross weight from the full weight ticket.')}
          {field('tareWeight', 'Empty vehicle weight (lb)', 'Tare weight from the empty weight ticket; zero is permitted.')}
        </>}
        {!civilian && <>
          {field('pbpe', 'Member pro gear (lb)', 'Declared and documented PBP&E; 2,000 lb credit across all shipments.')}
          {combined ? field('secondaryPbpe', 'Second military member pro gear (lb)', 'Separate 2,000 lb credit for the second member.') : field('spousePbpe', 'Dependent spouse pro gear (lb)', 'Up to 500 lb across all shipments, with required approval.')}
        </>}
      </div>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <div className="actions"><Button type="submit" variant="outlined">{government ? 'Add government shipment' : 'Add weight ticket'}</Button></div>
    </form>
    {rows.length > 0 ? <div className="table-scroll"><table className="data-table" aria-label={title}>
      <caption>{rows.length} {rows.length === 1 ? 'entry' : 'entries'} recorded · all weights in pounds</caption>
      <thead><tr>{government ? <><th>Type</th><th>Recorded</th><th>Packing</th></> : <><th>Loaded</th><th>Empty</th><th>Net</th></>}
        {!civilian && <><th>Member pro</th><th>{combined ? 'Second member pro' : 'Spouse pro'}</th></>}<th className="no-print">Action</th></tr></thead>
      <tbody>{rows.map((row, index) => <tr key={index}>
        {government ? <><td>{row.moveType}</td><td>{pounds(row.netWeight)}</td><td>{row.packingMethod === 'actual' ? `${pounds(row.packingWeight)} lb` : row.packingMethod === 'none' ? 'None' : `${row.packingMethod}%`}</td></> :
          <><td>{pounds(row.grossWeight)}</td><td>{pounds(row.tareWeight)}</td><td>{pounds(Number(row.grossWeight) - Number(row.tareWeight))}</td></>}
        {!civilian && <><td>{pounds(row.pbpe || 0)}</td><td>{pounds((combined ? row.secondaryPbpe : row.spousePbpe) || 0)}</td></>}
        <td className="no-print"><Button size="small" color="error" aria-label={`Remove ${government ? 'shipment' : 'ticket'} ${index + 1}`} onClick={() => setRows(rows.filter((_, i) => i !== index))}>Remove</Button></td>
      </tr>)}</tbody>
    </table></div> : <p className="notice">{government ? 'No government shipments added. Skip this section if the entire move is a PPM.' : 'No weight tickets added yet.'}</p>}
  </section>;
}
