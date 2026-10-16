/**
 * Retrieves or generates a persistent visitor UUID stored in localStorage (B-10, F-5)
 */
export function getOrCreateVisitorId() {
  const STORAGE_KEY = 'devfolio_visitor_id';
  let visitorId = localStorage.getItem(STORAGE_KEY);
  if (!visitorId) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      visitorId = crypto.randomUUID();
    } else {
      visitorId = 'vis_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
    }
    localStorage.setItem(STORAGE_KEY, visitorId);
  }
  return visitorId;
}
