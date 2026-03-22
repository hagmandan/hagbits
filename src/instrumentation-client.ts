import { app } from '@/lib/firebase';
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics(app);

export function onRouterTransitionStart(url: string) {
  logEvent(analytics, 'page_view', { page_path: url });
}
