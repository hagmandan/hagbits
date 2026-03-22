'use client';
import { app } from './firebase';
import { getAnalytics, Analytics } from 'firebase/analytics';

let _analytics: Analytics | null = null;

export function getFirebaseAnalytics(): Analytics | null {
  if (typeof window === 'undefined') return null;
  if (!_analytics) _analytics = getAnalytics(app);
  return _analytics;
}
