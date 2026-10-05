import { SUBSCRIPTION_ALIASES } from '../config/subscriptionAliases.js';

export function normalizeVendorName(vendor = '') {
  return String(vendor).toUpperCase().replace(/[^A-Z0-9+/. ]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function subscriptionSearchText(tx = {}) {
  return normalizeVendorName([tx.vendor, tx.description, tx.messagebody, tx.category].filter(Boolean).join(' '));
}

export function matchSubscriptionAlias(txOrText) {
  const normalized = typeof txOrText === 'string' ? normalizeVendorName(txOrText) : subscriptionSearchText(txOrText);
  for (const group of SUBSCRIPTION_ALIASES) {
    const match = group.aliases.find(alias => normalized.includes(normalizeVendorName(alias)));
    if (match) return { service: group.service, normalizedVendor: normalizeVendorName(typeof txOrText === 'string' ? txOrText : txOrText.vendor), alias: match };
  }
  return null;
}

export function isConfirmedSubscription(tx) {
  return tx.category === 'subscriptions' && Boolean(matchSubscriptionAlias(tx));
}
