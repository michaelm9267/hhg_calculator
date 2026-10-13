import React from 'react';
import ShipmentEditor from './ShipmentEditor';
export default function GovMove({ govMoves, setGovMoves, combined, civilian }) {
  return <ShipmentEditor rows={govMoves} setRows={setGovMoves} government combined={combined} civilian={civilian} />;
}
