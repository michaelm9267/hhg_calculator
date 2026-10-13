import React from 'react';
import ShipmentEditor from './ShipmentEditor';
export default function WeightTickets({ weightTickets, setWeightTickets, combined, civilian }) {
  return <ShipmentEditor rows={weightTickets} setRows={setWeightTickets} combined={combined} civilian={civilian} />;
}
