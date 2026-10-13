import { getStoragePeriod, NTS_SERVICES } from './utils';

const PROFILE_KEY = 'hhg.jber.nts-rates.v1';
export const JBER_LOCATION = 'JBER / Anchorage, Alaska';
const validateProfile = (profile) => {
  if (!profile || typeof profile.rateSource !== 'string' || !profile.rateSource.trim()) throw new Error('Enter the JBER rate sheet source before saving.');
  getStoragePeriod(profile.rateDate, profile.rateDate);
  if (NTS_SERVICES.some(([key]) => profile.rates?.[key] === '' || profile.rates?.[key] == null ||
    !Number.isFinite(Number(profile.rates[key])) || Number(profile.rates[key]) < 0)) throw new Error('Enter all seven verified JBER rates; use zero only for a service not included.');
};
export const loadJBERDefaults = () => {
  try {
    const profile = JSON.parse(window.localStorage.getItem(PROFILE_KEY));
    validateProfile(profile);
    return { location: JBER_LOCATION, rateSource: profile.rateSource, rateDate: profile.rateDate,
      rates: Object.fromEntries(NTS_SERVICES.map(([key]) => [key, String(profile.rates[key])])), profileStatus: 'saved' };
  } catch { return null; }
};
export const saveJBERDefaults = (form) => {
  if (!/\b(JBER|Anchorage)\b/i.test(form.location || '')) throw new Error('These defaults are for JBER / Anchorage. Use a verified JBER rate sheet.');
  if (!form.ratesVerified) throw new Error('Confirm transportation-office verification before saving JBER defaults.');
  validateProfile(form);
  const profile = { version: 1, rateSource: form.rateSource.trim(), rateDate: form.rateDate,
    rates: Object.fromEntries(NTS_SERVICES.map(([key]) => [key, String(form.rates[key])])) };
  try { window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }
  catch { throw new Error('This browser could not save the rate defaults. You can still use the rates for this estimate.'); }
};
