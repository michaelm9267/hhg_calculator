import ranks from '../../backend/ranks.json';
import { getTotalWeights, calculateNTS, getStoragePeriod, validateShipment } from './utils';

const member = { rank: 'E5', dependents: 'No', jointSpouse: 'No', govQtrs: 'No' };
test('O5 without dependents receives a 16000 pound allowance', () => {
  expect(getTotalWeights({ ...member, rank: 'O5' }, [], [], ranks).maxWeightAllowance).toBe(16000);
});
test('quarters do not erase the PCS weight limit', () => {
  expect(getTotalWeights({ ...member, govQtrs: 'Yes' }, [], [], ranks).maxWeightAllowance).toBe(7000);
});
test('overweight tickets remain unchanged and excess is reported separately', () => {
  const tickets = [{ grossWeight: 12000, tareWeight: 2000, pbpe: 0 }];
  const result = getTotalWeights(member, [], tickets, ranks);
  expect(result.totalNetWeight).toBe(10000);
  expect(result.excessWeight).toBe(3000);
  expect(result.remainingEntitlement).toBe(0);
  expect(tickets[0].grossWeight).toBe(12000);
});
test('member and approved dependent-spouse pro gear caps apply across all shipments', () => {
  const tickets = [{ grossWeight: 6000, tareWeight: 1000, pbpe: 1500, spousePbpe: 400 },
    { grossWeight: 5000, tareWeight: 1000, pbpe: 1000, spousePbpe: 200 }];
  const result = getTotalWeights({ ...member, spouseProApproved: true }, [], tickets, ranks);
  expect(result.memberProCredit).toBe(2000);
  expect(result.spouseProCredit).toBe(500);
  expect(result.chargeableWeight).toBe(6500);
  expect(result.remainingEntitlement).toBe(500);
});
test('unapproved spouse pro gear remains chargeable', () => {
  const result = getTotalWeights(member, [], [{ grossWeight: 8000, tareWeight: 1000, spousePbpe: 500 }], ranks);
  expect(result.spouseProCredit).toBe(0);
  expect(result.chargeableWeight).toBe(7000);
});
test('government packing credit depends on shipment method and PPM receives none', () => {
  const result = getTotalWeights(member, [{ netWeight: 1000, packingMethod: '20', pbpe: 0 }],
    [{ grossWeight: 2000, tareWeight: 1000 }], ranks);
  expect(result.totalNetWeight).toBe(2000);
  expect(result.packingCredit).toBe(200);
  expect(result.chargeableWeight).toBe(1800);
});
test('combining military spouse allowances requires confirmation and separate dependency status', () => {
  expect(getTotalWeights({ ...member, jointSpouse: 'Yes', spouseRank: 'O1' }, [], [], ranks).maxWeightAllowance).toBe(7000);
  expect(getTotalWeights({ ...member, jointSpouse: 'Yes', spouseRank: 'O1', combinedOrdersConfirmed: true,
    spouseDependents: 'Yes' }, [], [], ranks).maxWeightAllowance).toBe(19000);
});
test('civilian shipments do not automatically receive military pro gear exclusions', () => {
  const result = getTotalWeights({ ...member, rank: 'CIV' }, [], [{ grossWeight: 19000, tareWeight: 0, pbpe: 2000 }], ranks);
  expect(result.chargeableWeight).toBe(19000);
  expect(result.excessWeight).toBe(1000);
});
test.each([
  [{ grossWeight: 100, tareWeight: 200 }, false, /empty.*loaded/i],
  [{ grossWeight: -1, tareWeight: 0 }, false, /positive/i],
  [{ grossWeight: 1000, tareWeight: 0, pbpe: 1001 }, false, /pro gear/i],
  [{ netWeight: 1000, packingMethod: 'actual', packingWeight: 1001 }, true, /packing/i],
])('rejects invalid shipment %j', (shipment, government, message) => {
  expect(validateShipment(shipment, government)).toMatch(message);
});
test('zero tare is valid and invalid numeric input is rejected', () => {
  expect(validateShipment({ grossWeight: 1000, tareWeight: '0', pbpe: '' }, false)).toBe('');
  expect(validateShipment({ grossWeight: 'bad', tareWeight: 0 }, false)).not.toBe('');
});
test('storage dates reject reversal and invalid dates', () => {
  expect(() => getStoragePeriod('2026-02-02', '2026-02-01')).toThrow();
  expect(() => getStoragePeriod('2026-02-30', '2026-03-01')).toThrow();
});
test.each([
  ['2026-01-01', '2026-01-01', 0.5],
  ['2026-01-01', '2026-01-16', 0.5],
  ['2026-01-01', '2026-01-17', 1],
  ['2026-01-01', '2026-02-01', 1],
  ['2026-01-31', '2026-02-28', 1],
  ['2024-02-29', '2024-03-15', 0.5],
  ['2026-01-01', '2026-02-16', 1.5],
])('PPM storage duration %s through %s produces %s months', (start, end, months) => {
  expect(getStoragePeriod(start, end).months).toBe(months);
});
const nts = { weight: 1000, start: '2026-01-01', end: '2026-02-01',
  rates: { pack: '2', drayIn: '3', handleIn: '4', storage: '5', handleOut: '6', drayOut: '7', unpack: '8' },
  servicesPerformed: true, ratesVerified: true, rateSource: 'Current AOR rate sheet', rateDate: '2026-01-01', authorized: true,
  method: 'actual', actualCost: 200, priorPayment: 50 };
test('NTS caps receipt reimbursement at GCC and subtracts prior payment', () => {
  const result = calculateNTS(nts);
  expect(result.ceiling).toBe(350);
  expect(result.reimbursement).toBe(150);
  expect(calculateNTS({ ...nts, actualCost: 500 }).reimbursement).toBe(300);
});
test('NTS monetary allowance must be explicitly counselor-authorized', () => {
  expect(() => calculateNTS({ ...nts, method: 'monetary' })).toThrow(/monetary/i);
  expect(calculateNTS({ ...nts, method: 'monetary', monetaryAuthorized: true, servicesPerformed: true }).reimbursement).toBe(300);
});
test.each([
  [{ ratesVerified: false }, /rates/i], [{ authorized: false }, /authoriz/i],
  [{ rateSource: '' }, /source/i], [{ rateDate: '' }, /date/i],
  [{ weight: -5 }, /weight/i], [{ rates: { ...nts.rates, storage: '' } }, /rate/i],
  [{ priorPayment: -1 }, /payment/i], [{ actualCost: '' }, /receipt/i],
  [{ end: '2025-01-01' }, /date/i],
])('NTS blocks invalid or unverified inputs %j', (change, message) => {
  expect(() => calculateNTS({ ...nts, ...change })).toThrow(message);
});

test('monetary NTS excludes payment for unperformed services', () => {
  expect(() => calculateNTS({ ...nts, method: 'monetary', monetaryAuthorized: true, servicesPerformed: false })).toThrow(/performed/i);
});
test('confirmed storage months replace the duration estimate and must be half-month increments', () => {
  expect(calculateNTS({ ...nts, useConfirmedMonths: true, confirmedMonths: 2 }).ceiling).toBe(400);
  expect(() => calculateNTS({ ...nts, useConfirmedMonths: true, confirmedMonths: 1.2 })).toThrow(/half months/i);
});
test('civilian mode refuses military percentage packing adjustments', () => {
  const result = getTotalWeights({ ...member, rank: 'CIV' }, [{ netWeight: 20000, packingMethod: '10' }], [], ranks);
  expect(result.errors.join(' ')).toMatch(/civilian.*packing/i);
});

test('actual-cost NTS also requires performed or paid services', () => {
  expect(() => calculateNTS({ ...nts, servicesPerformed: false })).toThrow(/performed/i);
});
