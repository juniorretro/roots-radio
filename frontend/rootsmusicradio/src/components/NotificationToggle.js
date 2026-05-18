import React, { useState, useEffect } from 'react';
import { requestPermission, isPushEnabled, setPushEnabled } from '../services/pushNotifications';

const NotificationToggle = ({ style = {} }) => {
  const [enabled, setEnabled]     = useState(isPushEnabled);
  const [support, setSupport]     = useState(true);
  const [denied, setDenied]       = useState(false);

  useEffect(() => {
    if (!('Notification' in window)) { setSupport(false); return; }
    setDenied(Notification.permission === 'denied');
  }, []);

  const toggle = async () => {
    if (!support) return;
    if (enabled) {
      setPushEnabled(false);
      setEnabled(false);
      return;
    }
    const result = await requestPermission();
    if (result === 'granted') {
      setPushEnabled(true);
      setEnabled(true);
    } else if (result === 'denied') {
      setDenied(true);
    }
  };

  if (!support) return null;

  return (
    <button
      onClick={toggle}
      disabled={denied}
      title={denied ? 'Notifications bloquées dans le navigateur' : enabled ? 'Désactiver les notifications' : 'Activer les notifications'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '7px 14px', borderRadius: 20, border: 'none',
        background: enabled ? 'rgba(34,197,94,0.12)' : 'rgba(0,0,0,0.06)',
        color: enabled ? '#15803d' : '#666',
        fontSize: 13, fontWeight: 500, cursor: denied ? 'not-allowed' : 'pointer',
        opacity: denied ? 0.5 : 1, transition: 'all 0.2s',
        ...style,
      }}
    >
      <i className={`bi bi-bell${enabled ? '-fill' : ''}`} />
      {enabled ? 'Notifs ON' : 'Notifs OFF'}
    </button>
  );
};

export default NotificationToggle;
