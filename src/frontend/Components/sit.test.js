import { calculateSIT, getSITPeriod } from './utils';

const sit = {
  start: '2026-01-01', end: '2026-01-16', approvedDays: '90', priorDays: '0',
  weight: '1000', basis: 'domestic', minimumWeight: '1000', firstDayRate: '10', dailyRate: '1',
  payablePercent: '50', deliveryCharge: '20', deliveryAuthorized: true,
  authorized: true, extensionApproved: false, approvalReference: '',
  ratesVerified: true, rateSource: '2026 counselor rate quote', rateDate: '2026-01-01',
  facilityEligible: true, servicesPerformed: true, actualCost: '150', priorPayment: '10',
};

test('SIT counts both dates and bills only 15 additional days in a 16-day stay', () => {
  const result = calculateSIT(sit);
  expect(result.days).toBe(16);
  expect(result.additionalDays).toBe(15);
  expect(result.firstDayCost).toBe(50);
  expect(result.additionalDayCost).toBe(75);
  expect(result.deliveryCost).toBe(10);
  expect(result.ceiling).toBe(135);
  expect(result.reimbursement).toBe(125);
});
test('same-day SIT charges one first day and zero additional days', () => {
  const result = calculateSIT({ ...sit, end: sit.start, deliveryCharge: '0' });
  expect(result.days).toBe(1);
  expect(result.additionalDays).toBe(0);
  expect(result.ceiling).toBe(50);
});
test('SIT expiry accounts for prior storage under the same orders', () => {
  const result = calculateSIT({ ...sit, start: '2026-01-01', end: '2026-01-15', priorDays: '80', deliveryCharge: '0' });
  expect(result.expiration).toBe('2026-01-10');
  expect(result.authorizedDays).toBe(10);
  expect(result.unauthorizedDays).toBe(5);
  expect(result.ceiling).toBe(95);
});
test('the 90th day is authorized and the 91st day is outside approval', () => {
  const period = getSITPeriod({ ...sit, start: '2026-01-01', end: '2026-04-01' });
  expect(period.days).toBe(91);
  expect(period.expiration).toBe('2026-03-31');
  expect(period.authorizedDays).toBe(90);
  expect(period.unauthorizedDays).toBe(1);
});
test('approved extensions require written confirmation and a reference', () => {
  expect(() => calculateSIT({ ...sit, approvedDays: '180' })).toThrow(/extension/i);
  expect(() => calculateSIT({ ...sit, approvedDays: '180', extensionApproved: true })).toThrow(/reference/i);
  const result = calculateSIT({ ...sit, approvedDays: '180', extensionApproved: true, approvalReference: 'DD1857-1', end: '2026-04-01' });
  expect(result.unauthorizedDays).toBe(0);
  expect(result.expiration).toBe('2026-06-29');
});
test('domestic tariff minimum affects GCC without changing actual stored weight', () => {
  const result = calculateSIT({ ...sit, weight: '600', end: sit.start, deliveryCharge: '0' });
  expect(result.weight).toBe(600);
  expect(result.billableWeight).toBe(1000);
  expect(result.ceiling).toBe(50);
});
test.each(['international-conus', 'international-oconus'])('international SIT uses tariff rates without the domestic payable factor (%s)', basis => {
  const result = calculateSIT({ ...sit, basis, minimumWeight: '500', weight: '400', deliveryCharge: '0', actualCost: '200' });
  expect(result.billableWeight).toBe(500);
  expect(result.firstDayCost).toBe(50);
  expect(result.additionalDayCost).toBe(75);
  expect(result.ceiling).toBe(125);
});
test('actual costs cap payment and previous payments produce a separately reported overpayment', () => {
  const result = calculateSIT({ ...sit, actualCost: '70', priorPayment: '100' });
  expect(result.allowance).toBe(70);
  expect(result.reimbursement).toBe(0);
  expect(result.overpaid).toBe(30);
});
test('expired SIT has no storage GCC but separately approved delivery can remain eligible', () => {
  const result = calculateSIT({ ...sit, priorDays: '90' });
  expect(result.authorizedDays).toBe(0);
  expect(result.firstDayCost).toBe(0);
  expect(result.additionalDayCost).toBe(0);
  expect(result.deliveryCost).toBe(10);
});
test.each([
  [{ weight: '0' }, /weight/i], [{ dailyRate: '-1' }, /rate/i],
  [{ firstDayRate: '' }, /rate/i], [{ minimumWeight: '-1' }, /minimum/i],
  [{ payablePercent: '' }, /factor/i], [{ payablePercent: '101' }, /factor/i],
  [{ authorized: false }, /authorization/i], [{ ratesVerified: false }, /rates/i],
  [{ rateSource: '' }, /source/i], [{ rateDate: '2026-02-30' }, /date/i],
  [{ facilityEligible: false }, /commercial/i], [{ servicesPerformed: false }, /performed/i],
  [{ deliveryAuthorized: false }, /delivery/i], [{ approvedDays: '90.5' }, /whole/i],
  [{ priorDays: '-1' }, /whole/i], [{ actualCost: '' }, /receipt/i],
  [{ priorPayment: '-1' }, /payment/i], [{ basis: 'unknown' }, /basis/i],
  [{ end: '2025-12-01' }, /date/i],
])('SIT refuses unsupported input %j', (change, message) => {
  expect(typeof calculateSIT).toBe('function');
  expect(() => calculateSIT({ ...sit, ...change })).toThrow(message);
});
test('inclusive SIT day counts remain correct across leap day and daylight saving time', () => {
  expect(getSITPeriod({ ...sit, start: '2024-02-28', end: '2024-03-01' }).days).toBe(3);
  expect(getSITPeriod({ ...sit, start: '2026-03-07', end: '2026-03-09' }).days).toBe(3);
});
test('SIT rounds each government cost line to cents before summing the displayed total', () => {
  const result = calculateSIT({ ...sit, weight: '100', minimumWeight: '100', end: '2026-01-02',
    firstDayRate: '0.05', dailyRate: '0.05', deliveryCharge: '0', actualCost: '1', priorPayment: '0' });
  expect(result.firstDayCost).toBe(0.03);
  expect(result.additionalDayCost).toBe(0.03);
  expect(result.ceiling).toBe(0.06);
});
