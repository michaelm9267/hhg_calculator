import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

beforeEach(() => { window.location.hash = ''; window.localStorage.clear(); });
test('opens a usable calculator on the home page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'PPM weight planner' })).toBeInTheDocument();
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});
test('invalid tickets cannot be added and zero tare is accepted', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Loaded vehicle weight (lb)'), { target: { value: '1000' } });
  fireEvent.change(screen.getByLabelText('Empty vehicle weight (lb)'), { target: { value: '2000' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add weight ticket' }));
  expect(screen.getByRole('alert')).toHaveTextContent(/empty.*loaded/i);
  expect(screen.queryByRole('table', { name: 'PPM weight tickets' })).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Empty vehicle weight (lb)'), { target: { value: '0' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add weight ticket' }));
  expect(within(screen.getByRole('table', { name: 'PPM weight tickets' })).getAllByText('1,000')).toHaveLength(2);
});
test('weights survive switching between calculators', async () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Loaded vehicle weight (lb)'), { target: { value: '1000' } });
  fireEvent.change(screen.getByLabelText('Empty vehicle weight (lb)'), { target: { value: '0' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add weight ticket' }));
  fireEvent.click(screen.getByRole('link', { name: 'NTS storage' }));
  expect(await screen.findByRole('heading', { name: 'NTS cost estimator' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: 'PPM weights' }));
  expect(await screen.findByRole('table', { name: 'PPM weight tickets' })).toBeInTheDocument();
});
test('NTS rejects incomplete storage details', async () => {
  window.location.hash = '#/nts';
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Calculate storage estimate' }));
  expect(screen.getByRole('alert')).toHaveTextContent(/weight/i);
  expect(screen.queryByLabelText('Storage cost result')).not.toBeInTheDocument();
});

test('pay grade can be corrected after adding tickets without changing ticket weights', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Pay grade'), { target: { value: 'E5' } });
  fireEvent.change(screen.getByLabelText('Loaded vehicle weight (lb)'), { target: { value: '1000' } });
  fireEvent.change(screen.getByLabelText('Empty vehicle weight (lb)'), { target: { value: '0' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add weight ticket' }));
  expect(screen.getByLabelText('Pay grade')).not.toBeDisabled();
  fireEvent.change(screen.getByLabelText('Pay grade'), { target: { value: 'O5' } });
  expect(within(screen.getByLabelText('Weight summary')).getByText('16,000 lb')).toBeInTheDocument();
});

test('NTS calculates from verified rates and clears stale results after an edit', () => {
  window.location.hash = '#/nts';
  render(<App />);
  const enter = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
  enter('Authorized storage weight (lb)', '1000');
  enter('Storage entry date', '2026-01-01');
  enter('Storage release date', '2026-02-01');
  enter('Rate source / tender reference', '2026 AOR rates');
  enter('Rate sheet effective date', '2026-01-01');
  ['Packing', 'Transport into storage', 'Handling in', 'Handling out', 'Delivery out', 'Unpacking'].forEach(label => enter(`${label} ($/cwt)`, '1'));
  enter('Monthly storage ($/cwt/month)', '1');
  enter('Eligible paid receipt costs ($)', '50');
  fireEvent.click(screen.getByLabelText(/authorization covers this location/i));
  fireEvent.click(screen.getByRole('button', { name: 'Calculate storage estimate' }));
  expect(screen.getByRole('alert')).toHaveTextContent(/rates/i);
  fireEvent.click(screen.getByLabelText(/verified these rates/i));
  fireEvent.click(screen.getByLabelText(/Included services have been performed/i));
  fireEvent.click(screen.getByRole('button', { name: 'Calculate storage estimate' }));
  const result = screen.getByLabelText('Storage cost result');
  expect(within(result).getByText('$70.00')).toBeInTheDocument();
  expect(within(result).getAllByText('$50.00')).toHaveLength(2);
  enter('Authorized storage weight (lb)', '2000');
  expect(screen.queryByLabelText('Storage cost result')).not.toBeInTheDocument();
});
test('switching to civilian rules resets an incompatible packing draft', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Pay grade'), { target: { value: 'E5' } });
  fireEvent.change(screen.getByLabelText('Recorded shipment weight (lb)'), { target: { value: '1000' } });
  fireEvent.change(screen.getByLabelText('Confirmed packing adjustment'), { target: { value: '50' } });
  fireEvent.change(screen.getByLabelText('Pay grade'), { target: { value: 'CIV' } });
  expect(screen.getByLabelText('Confirmed packing adjustment')).toHaveValue('none');
  fireEvent.click(screen.getByRole('button', { name: 'Add government shipment' }));
  expect(within(screen.getByLabelText('Weight summary')).getByText('17,000 lb')).toBeInTheDocument();
});
test('a blank grade cannot bypass military/civilian rules after tickets are entered', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Pay grade'), { target: { value: 'E5' } });
  fireEvent.change(screen.getByLabelText('Loaded vehicle weight (lb)'), { target: { value: '1000' } });
  fireEvent.change(screen.getByLabelText('Empty vehicle weight (lb)'), { target: { value: '0' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add weight ticket' }));
  fireEvent.change(screen.getByLabelText('Pay grade'), { target: { value: '' } });
  expect(screen.getByLabelText('Pay grade')).toHaveValue('E5');
});
test('the skip link focuses the calculator without changing its route', () => {
  window.location.hash = '#/nts';
  render(<App />);
  fireEvent.click(screen.getByRole('link', { name: 'Skip to calculator' }));
  expect(screen.getByRole('main')).toHaveFocus();
  expect(window.location.hash).toBe('#/nts');
});

test('SIT is reachable and inputs persist when switching calculators', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('link', { name: 'SIT temporary storage' }));
  expect(await screen.findByRole('heading', { name: 'SIT cost calculator' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('SIT entry date'), { target: { value: '2026-01-01' } });
  fireEvent.click(screen.getByRole('link', { name: 'PPM weights' }));
  await screen.findByRole('heading', { name: 'PPM weight planner' });
  fireEvent.click(screen.getByRole('link', { name: 'SIT temporary storage' }));
  expect(await screen.findByLabelText('SIT entry date')).toHaveValue('2026-01-01');
});
test('NTS starts with JBER location and explicitly pending dollar rates', () => {
  window.location.hash = '#/nts';
  render(<App />);
  expect(screen.getByLabelText('Storage location / rate area')).toHaveValue('JBER / Anchorage, Alaska');
  expect(screen.getByLabelText('Monthly storage ($/cwt/month)')).toHaveValue(null);
  expect(screen.getByText(/JBER rate sheet is needed/i)).toBeInTheDocument();
});

test('verified JBER defaults can be saved without carrying shipment authorization into a new session', () => {
  window.localStorage.clear();
  window.location.hash = '#/nts';
  const view = render(<App />);
  const enter = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
  enter('Rate source / tender reference', 'JBER verified sheet test fixture');
  enter('Rate sheet effective date', '2026-10-01');
  ['Packing', 'Transport into storage', 'Handling in', 'Handling out', 'Delivery out', 'Unpacking'].forEach(label => enter(`${label} ($/cwt)`, '2'));
  enter('Monthly storage ($/cwt/month)', '3');
  fireEvent.click(screen.getByLabelText(/verified these rates/i));
  fireEvent.click(screen.getByRole('button', { name: 'Save as JBER defaults' }));
  expect(screen.getByRole('status')).toHaveTextContent(/saved/i);
  view.unmount();
  render(<App />);
  expect(screen.getByLabelText('Monthly storage ($/cwt/month)')).toHaveValue(3);
  expect(screen.getByLabelText('Rate source / tender reference')).toHaveValue('JBER verified sheet test fixture');
  expect(screen.getByLabelText(/verified these rates/i)).not.toBeChecked();
  expect(screen.getByLabelText(/authorization covers this location/i)).not.toBeChecked();
  window.localStorage.clear();
});
test('SIT validates authorization and hides a stale payment estimate after edits', () => {
  window.location.hash = '#/sit';
  render(<App />);
  const enter = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
  enter('SIT entry date', '2026-01-01'); enter('SIT release date', '2026-01-16');
  enter('Eligible storage weight (lb)', '1000');
  enter('First day + handling ($/cwt)', '10'); enter('Additional day ($/cwt/day)', '1');
  enter('Payable SIT factor (%)', '50');
  enter('Rate source / counselor quote', '2026 SIT fixture'); enter('Rate effective date', '2026-01-01');
  enter('Eligible paid receipt costs ($)', '150');
  fireEvent.click(screen.getByRole('button', { name: 'Calculate SIT reimbursement' }));
  expect(screen.getByRole('alert')).toHaveTextContent(/authorization/i);
  fireEvent.click(screen.getByLabelText(/Prior SIT authorization/i));
  fireEvent.click(screen.getByLabelText(/commercial facility/i));
  fireEvent.click(screen.getByLabelText(/SIT rates and billing basis/i));
  fireEvent.click(screen.getByLabelText(/Included services are performed/i));
  fireEvent.click(screen.getByRole('button', { name: 'Calculate SIT reimbursement' }));
  expect(within(screen.getByLabelText('SIT reimbursement result')).getAllByText('$125.00')).toHaveLength(3);
  enter('Additional day ($/cwt/day)', '2');
  expect(screen.queryByLabelText('SIT reimbursement result')).not.toBeInTheDocument();
  expect(screen.getByLabelText(/SIT rates and billing basis/i)).not.toBeChecked();
});

test('corrupt saved JBER profiles fall back to pending rates', () => {
  window.localStorage.setItem('hhg.jber.nts-rates.v1', '{bad-json');
  window.location.hash = '#/nts';
  render(<App />);
  expect(screen.getByLabelText('Monthly storage ($/cwt/month)')).toHaveValue(null);
  expect(screen.getByText(/JBER rate sheet is needed/i)).toBeInTheDocument();
});
