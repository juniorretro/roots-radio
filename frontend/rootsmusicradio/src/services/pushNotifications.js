const STORAGE_KEY = 'rr-push-enabled';

export const isPushEnabled = () => {
  try { return localStorage.getItem(STORAGE_KEY) === 'true'; }
  catch { return false; }
};

export const setPushEnabled = (val) => {
  try { localStorage.setItem(STORAGE_KEY, val ? 'true' : 'false'); }
  catch { /* ignore */ }
};

export const requestPermission = async () => {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied')  return 'denied';
  const result = await Notification.requestPermission();
  return result;
};

export const sendNotification = (title, options = {}) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const n = new Notification(title, {
      icon: '/logo192.png',
      badge: '/logo192.png',
      ...options,
    });
    n.onclick = () => { window.focus(); n.close(); };
    setTimeout(() => n.close(), 8000);
  } catch { /* Some browsers block non-HTTPS notifications */ }
};

export const notifyNowPlaying = (track) => {
  if (!isPushEnabled()) return;
  if (!track?.title) return;
  sendNotification(`🎵 ${track.title}`, {
    body: track.artist ? `${track.artist} — En direct sur Roots Radio FM` : 'En direct sur Roots Radio FM',
    tag: 'now-playing',
  });
};
