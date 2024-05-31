import React from "react";

const PrintForm = ({
  grade,
  name,
  ssn,
  orderNumber,
  joinSpouse,
  spouseGrade,
  dependents,
  toFromGovtQtrs,
  gamMoves,
  weightTickets,
  totalWeight
}) => {
  const maskedSSN = ssn.replace(/^(\d{5})(\d{4})$/, "*****$2");

  return (
    <div>
      <h2>Form</h2>
      <div><strong>Grade:</strong> {grade}</div>
      <div><strong>Name:</strong> {name}</div>
      <div><strong>SSN:</strong> {maskedSSN}</div>
      <div><strong>Order Number:</strong> {orderNumber}</div>
      <div><strong>Join Spouse:</strong> {joinSpouse}</div>
      {joinSpouse === "Yes" && (
        <div><strong>Spouse Grade:</strong> {spouseGrade}</div>
      )}
      <div><strong>Dependents:</strong> {dependents}</div>
      <div><strong>To/From Govt Qtrs:</strong> {toFromGovtQtrs}</div>
      <h3>Government Arrange Moves</h3>
      {gamMoves.map((move, index) => (
        <div key={index}>
          <div><strong>Move {index + 1}:</strong></div>
          <div>Method: {move.method}</div>
          <div>Weight: {move.weight}</div>
          <div>PBP&E: {move.pbpe}</div>
          <div>Total Weight: {move.totalWeight}</div>
        </div>
      ))}
      <h3>Weight Tickets</h3>
      {weightTickets.map((ticket, index) => (
        <div key={index}>
          <div><strong>Ticket {index + 1}:</strong></div>
          <div>Gross Weight: {ticket.grossWeight}</div>
          <div>Tare Weight: {ticket.tareWeight}</div>
          <div>Total: {ticket.total}</div>
        </div>
      ))}
      <h3>Overall Totals</h3>
      <div><strong>Total Weight:</strong> {totalWeight}</div>
    </div>
  );
};

export default PrintForm;
