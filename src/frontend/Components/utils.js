// Policy references and boundaries are documented in docs/policy-review.md.
const number = (value) => Number(value || 0);
const validNumber = (value) => value !== undefined && value !== null && value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0;
const sum = (rows, field) => rows.reduce((total, row) => total + number(row[field]), 0);

export const validateShipment = (shipment, government = false) => {
  const weight = government ? shipment.netWeight : shipment.grossWeight;
  if (!validNumber(weight) || Number(weight) <= 0) return 'Enter a positive weight in pounds.';
  if (!government && !validNumber(shipment.tareWeight)) return 'Enter the empty vehicle weight, including zero when applicable.';
  if (!government && number(shipment.tareWeight) > number(weight)) return 'Empty vehicle weight cannot exceed loaded vehicle weight.';
  const net = government ? number(weight) : number(weight) - number(shipment.tareWeight);
  const proFields = ['pbpe', 'spousePbpe', 'secondaryPbpe'];
  if (proFields.some((field) => shipment[field] !== undefined && shipment[field] !== '' && !validNumber(shipment[field]))) return 'Pro gear weights must be nonnegative numbers.';
  let packing = 0;
  if (government) {
    if (!['none', '10', '20', '50', 'actual'].includes(shipment.packingMethod)) return 'Select the applicable packing adjustment.';
    if (shipment.packingMethod === 'actual' && !validNumber(shipment.packingWeight)) return 'Enter the verified packing weight.';
    packing = shipment.packingMethod === 'actual' ? number(shipment.packingWeight) : net * number(shipment.packingMethod === 'none' ? 0 : shipment.packingMethod) / 100;
    if (packing > net) return 'Packing weight cannot exceed the recorded shipment weight.';
  }
  if (proFields.reduce((total, field) => total + number(shipment[field]), 0) > net - packing) return 'Pro gear cannot exceed the shipment weight after the packing adjustment.';
  return '';
};

export const getTotalWeights = (memberInfo, govMoves, weightTickets, ranks) => {
  const civilian = memberInfo.rank === 'CIV';
  const combined = !civilian && memberInfo.jointSpouse === 'Yes' && memberInfo.combinedOrdersConfirmed === true && !!memberInfo.spouseRank;
  const allowance = (grade, dependents) => ranks.find((rank) => rank.grade === grade)?.weightAllowance[dependents === 'Yes' ? 'withDependents' : 'withoutDependents'] || 0;
  const standardAllowance = allowance(memberInfo.rank, memberInfo.dependents) + (combined ? allowance(memberInfo.spouseRank, memberInfo.spouseDependents) : 0);
  const hasOverride = memberInfo.useAuthorizedAllowance === true;
  const overrideValid = validNumber(memberInfo.authorizedAllowance);
  const maxWeightAllowance = hasOverride ? (overrideValid ? number(memberInfo.authorizedAllowance) : 0) : standardAllowance;
  const rows = [...govMoves, ...weightTickets];
  const errors = rows.map((row, index) => validateShipment(row, index < govMoves.length)).filter(Boolean);
  if (!memberInfo.rank) errors.push('Select a pay grade to determine the allowance.');
  if (civilian && govMoves.some((row) => ['10', '20', '50'].includes(row.packingMethod))) errors.push('Civilian shipments require counselor-verified weights; remove military percentage packing adjustments.');
  if (hasOverride && (!overrideValid || !memberInfo.allowanceReference?.trim())) errors.push('Enter the counselor-authorized weight allowance and its order or approval reference.');
  if (memberInfo.jointSpouse === 'Yes' && !combined) errors.push('Confirm both orders and the combined shipment authorization, or select an individual shipment.');
  const totalPPMNet = weightTickets.reduce((total, row) => total + number(row.grossWeight) - number(row.tareWeight), 0);
  const totalGovNet = sum(govMoves, 'netWeight');
  const packingCredit = govMoves.reduce((total, row) => total + (row.packingMethod === 'actual' ? number(row.packingWeight) : number(row.netWeight) * number(row.packingMethod === 'none' ? 0 : row.packingMethod) / 100), 0);
  const memberProDeclared = sum(rows, 'pbpe');
  const spouseProDeclared = sum(rows, 'spousePbpe');
  const secondaryProDeclared = sum(rows, 'secondaryPbpe');
  const memberProCredit = civilian ? 0 : Math.min(2000, memberProDeclared);
  const spouseProCredit = civilian || combined || !memberInfo.spouseProApproved ? 0 : Math.min(500, spouseProDeclared);
  const secondaryProCredit = combined ? Math.min(2000, secondaryProDeclared) : 0;
  const totalProCredit = memberProCredit + spouseProCredit + secondaryProCredit;
  const totalNetWeight = totalGovNet + totalPPMNet;
  const chargeableWeight = Math.max(0, totalNetWeight - packingCredit - totalProCredit);
  const remainingEntitlement = Math.max(0, maxWeightAllowance - chargeableWeight);
  const excessWeight = Math.max(0, chargeableWeight - maxWeightAllowance);
  const warnings = [];
  if (memberProDeclared > memberProCredit || spouseProDeclared > spouseProCredit || secondaryProDeclared > secondaryProCredit) warnings.push('Pro gear above the applicable limit, or without approval, remains chargeable to the HHG allowance.');
  if (civilian) warnings.push('Civilian entitlement and packing rules differ. Use counselor-verified net weights; military pro gear credits are not applied.');
  return { totalNetWeight, totalPPMNet, totalGovNet, packingCredit, memberProCredit, spouseProCredit, secondaryProCredit,
    totalProCredit, chargeableWeight, standardAllowance, maxWeightAllowance, remainingEntitlement, excessWeight, errors, warnings };
};

const parseDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) throw new Error('Enter valid storage dates.');
  const date = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new Error('Enter valid storage dates.');
  return date;
};
const addMonths = (date, months) => {
  const first = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  return new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), Math.min(date.getUTCDate(), lastDay)));
};
export const getStoragePeriod = (start, end) => {
  const inDate = parseDate(start);
  const outDate = parseDate(end);
  if (outDate < inDate) throw new Error('Storage release date cannot precede the entry date.');
  const days = (outDate - inDate) / 86400000;
  let wholeMonths = (outDate.getUTCFullYear() - inDate.getUTCFullYear()) * 12 + outDate.getUTCMonth() - inDate.getUTCMonth();
  if (addMonths(inDate, wholeMonths) > outDate) wholeMonths -= 1;
  const remainingDays = (outDate - addMonths(inDate, wholeMonths)) / 86400000;
  const months = Math.max(0.5, wholeMonths + (remainingDays > 15 ? 1 : remainingDays > 0 ? 0.5 : 0));
  return { days, months, wholeMonths, remainingDays };
};
export const NTS_SERVICES = [
  ['pack', 'Packing'], ['drayIn', 'Transport into storage'], ['handleIn', 'Handling in'],
  ['storage', 'Monthly storage'], ['handleOut', 'Handling out'], ['drayOut', 'Delivery out'], ['unpack', 'Unpacking'],
];
export const calculateNTS = (input) => {
  if (!validNumber(input.weight) || Number(input.weight) <= 0) throw new Error('Enter a positive authorized storage weight.');
  const period = getStoragePeriod(input.start, input.end);
  if (!input.authorized) throw new Error('Confirm authorization covers the storage location, weight, and full period.');
  if (!input.ratesVerified) throw new Error('Verify the applicable current rates with the transportation office.');
  if (!input.rateSource?.trim()) throw new Error('Enter the current rate source or tender reference.');
  parseDate(input.rateDate);
  if (NTS_SERVICES.some(([key]) => !validNumber(input.rates[key]))) throw new Error('Enter each applicable rate; use zero for services not included.');
  if (!validNumber(input.priorPayment)) throw new Error('Enter prior payment as a nonnegative amount, including zero.');
  const cwt = Number(input.weight) / 100;
  const billableMonths = input.useConfirmedMonths ? Number(input.confirmedMonths) : period.months;
  if (input.useConfirmedMonths && (!validNumber(input.confirmedMonths) || billableMonths <= 0 || billableMonths * 2 !== Math.round(billableMonths * 2))) throw new Error('Confirmed storage months must be positive whole or half months.');
  const items = NTS_SERVICES.map(([key, label]) => ({ key, label, rate: Number(input.rates[key]), total: Number(input.rates[key]) * cwt * (key === 'storage' ? billableMonths : 1) }));
  const ceiling = items.reduce((total, item) => total + item.total, 0);
  let allowance;
  if (input.method === 'monetary') {
    if (!input.monetaryAuthorized) throw new Error('Confirm counselor authorization for the DAF monetary allowance method.');
    if (!input.servicesPerformed) throw new Error('Confirm included services have been performed or paid for.');
    allowance = ceiling;
  } else {
    if (input.method !== 'actual') throw new Error('Select a payment method.');
    if (!validNumber(input.actualCost)) throw new Error('Enter eligible paid receipt costs, including zero.');
    if (!input.servicesPerformed) throw new Error('Confirm included services have been performed or paid for.');
    allowance = Math.min(Number(input.actualCost), ceiling);
  }
  return { ...period, months: billableMonths, cwt, items, ceiling, allowance,
    reimbursement: Math.max(0, allowance - Number(input.priorPayment)),
    overpaid: Math.max(0, Number(input.priorPayment) - allowance) };
};

// SIT uses inclusive daily billing, independent of NTS month rounding.
export const getSITPeriod = (input) => {
  const days = getStoragePeriod(input.start, input.end).days + 1;
  const approvedDays = Number(input.approvedDays);
  const priorDays = Number(input.priorDays);
  if (!validNumber(input.approvedDays) || !Number.isSafeInteger(approvedDays) || approvedDays <= 0 ||
    !validNumber(input.priorDays) || !Number.isSafeInteger(priorDays)) throw new Error('Authorization and previously used days must be whole nonnegative days, with a positive authorization.');
  const availableDays = Math.max(0, approvedDays - priorDays);
  const authorizedDays = Math.min(days, availableDays);
  const expirationDate = parseDate(input.start);
  expirationDate.setUTCDate(expirationDate.getUTCDate() + approvedDays - priorDays - 1);
  if (!Number.isFinite(expirationDate.getTime()) || expirationDate.getUTCFullYear() < 1 || expirationDate.getUTCFullYear() > 9999) throw new Error('Enter an authorization period that produces a valid expiration date.');
  return { days, authorizedDays, unauthorizedDays: days - authorizedDays,
    additionalDays: Math.max(0, authorizedDays - 1), expiration: expirationDate.toISOString().slice(0, 10) };
};
export const calculateSIT = (input) => {
  const period = getSITPeriod(input);
  if (!validNumber(input.weight) || Number(input.weight) <= 0) throw new Error('Enter a positive eligible storage weight.');
  if (!['domestic', 'international-conus', 'international-oconus'].includes(input.basis)) throw new Error('Select the applicable SIT rate basis.');
  if (!validNumber(input.minimumWeight)) throw new Error('Enter the applicable nonnegative tariff minimum weight.');
  if (!input.authorized) throw new Error('Confirm prior transportation-office authorization for SIT.');
  if (Number(input.approvedDays) > 90) {
    if (!input.extensionApproved) throw new Error('Written extension approval is required for more than 90 days.');
    if (!input.approvalReference?.trim()) throw new Error('Enter the extension approval reference.');
  }
  if (!input.facilityEligible) throw new Error('Confirm an eligible commercial storage facility; private residences and lots do not qualify.');
  if (!input.ratesVerified) throw new Error('Confirm the applicable SIT rates with your transportation office.');
  if (!input.rateSource?.trim()) throw new Error('Enter the rate source or counselor quote reference.');
  parseDate(input.rateDate);
  if (![input.firstDayRate, input.dailyRate, input.deliveryCharge].every(validNumber)) throw new Error('Enter nonnegative rates and the delivery table charge, including zero when not applicable.');
  let factor = 1;
  if (input.basis === 'domestic') {
    if (!validNumber(input.payablePercent) || Number(input.payablePercent) > 100) throw new Error('Enter the verified payable SIT factor as a percentage from 0 to 100.');
    factor = Number(input.payablePercent) / 100;
  }
  if (Number(input.deliveryCharge) > 0 && !input.deliveryAuthorized) throw new Error('Confirm separate authorization and performance of the included delivery service.');
  if (!input.servicesPerformed) throw new Error('Confirm included services have been performed or paid for.');
  if (!validNumber(input.actualCost)) throw new Error('Enter eligible paid receipt costs for authorized services and days.');
  if (!validNumber(input.priorPayment)) throw new Error('Enter prior payment as a nonnegative amount, including zero.');
  const weight = Number(input.weight);
  const billableWeight = Math.max(weight, Number(input.minimumWeight));
  const cwt = billableWeight / 100;
  const cents = (amount) => Math.round((amount + Number.EPSILON * Math.max(1, Math.abs(amount))) * 100) / 100;
  const firstDayCost = cents(period.authorizedDays > 0 ? Number(input.firstDayRate) * cwt * factor : 0);
  const additionalDayCost = cents(Number(input.dailyRate) * cwt * period.additionalDays * factor);
  const deliveryCost = cents(Number(input.deliveryCharge) * factor);
  const ceiling = Math.round((firstDayCost + additionalDayCost + deliveryCost) * 100) / 100;
  if (!Number.isFinite(ceiling)) throw new Error('Rates and weights exceed the supported calculation range.');
  const allowance = Math.min(Number(input.actualCost), ceiling);
  return { ...period, weight, billableWeight, cwt, factor, firstDayCost, additionalDayCost, deliveryCost, ceiling, allowance,
    reimbursement: Math.max(0, allowance - Number(input.priorPayment)), overpaid: Math.max(0, Number(input.priorPayment) - allowance) };
};
