import React, { useState, useEffect, useRef } from 'react';
import { useRadio } from '../contexts/RadioContext';
import { useAuth } from '../contexts/AuthContext';

const LiveChat = () => {
  const { socket } = useRadio();
  const { user }   = useAuth();

  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState('');
  const [unread, setUnread]     = useState(0);
  const [username, setUsername] = useState(() => user?.username || localStorage.getItem('rr-chat-name') || '');
  const [nameSet, setNameSet]   = useState(!!user?.username || !!localStorage.getItem('rr-chat-name'));
  const bottomRef               = useRef(null);

  // Socket events
  useEffect(() => {
    if (!socket) return;
    const onHistory = (msgs) => setMessages(msgs || []);
    const onMessage = (msg) => {
      setMessages(prev => [...prev.slice(-49), msg]);
      if (!open) setUnread(u => u + 1);
    };
    const onClear = () => setMessages([]);
    socket.on('chatHistory', onHistory);
    socket.on('chatMessage',  onMessage);
    socket.on('chatClear',    onClear);
    return () => { socket.off('chatHistory', onHistory); socket.off('chatMessage', onMessage); socket.off('chatClear', onClear); };
  }, [socket, open]);

  // Auto-scroll
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  // Reset unread when opened
  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  // Sync username from user auth
  useEffect(() => {
    if (user?.username) { setUsername(user.username); setNameSet(true); }
  }, [user]);

  const saveName = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    localStorage.setItem('rr-chat-name', username.trim());
    setUsername(username.trim());
    setNameSet(true);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket) return;
    socket.emit('chatMessage', { text: text.trim(), username });
    setText('');
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{ position: 'fixed', bottom: 90, right: 16, zIndex: 998, width: 48, height: 48, borderRadius: '50%', background: '#000', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = ''}
      >
        <i className={`bi bi-chat${open ? '-x' : '-dots'}-fill`} style={{ fontSize: 20 }} />
        {unread > 0 && !open && (
          <span style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{ position: 'fixed', bottom: 148, right: 16, zIndex: 998, width: 320, background: 'var(--rr-surface, #fff)', borderRadius: 20, boxShadow: '0 16px 48px rgba(0,0,0,0.16)', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden', maxHeight: '60vh' }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>Chat en direct</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{messages.length} msg</span>
          </div>

          {/* Name prompt */}
          {!nameSet && (
            <div style={{ padding: 16, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: 13, marginBottom: 8, color: 'var(--rr-text, #000)' }}>Choisissez un pseudo pour participer :</p>
              <form onSubmit={saveName} style={{ display: 'flex', gap: 8 }}>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Votre pseudo" maxLength={50}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, outline: 'none', background: 'var(--rr-bg, #fafafa)', color: 'var(--rr-text, #000)' }} />
                <button type="submit" style={{ background: '#000', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>OK</button>
              </form>
            </div>
          )}

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#aaa', fontSize: 13, paddingTop: 20 }}>
                <i className="bi bi-chat-dots d-block mb-2" style={{ fontSize: 28 }} />
                Soyez le premier à écrire !
              </div>
            )}
            {messages.map(msg => {
              const isMe = msg.username === username;
              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  {!isMe && <span style={{ fontSize: 11, fontWeight: 600, color: '#888', marginBottom: 3 }}>{msg.username}</span>}
                  <div style={{ background: isMe ? '#000' : 'rgba(0,0,0,0.06)', color: isMe ? '#fff' : 'var(--rr-text, #000)', padding: '8px 12px', borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px', fontSize: 14, maxWidth: '85%', lineHeight: 1.4, wordBreak: 'break-word' }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: 10, color: '#aaa', marginTop: 3 }}>{formatTime(msg.at)}</span>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {nameSet && (
            <form onSubmit={sendMessage} style={{ padding: '10px 12px', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: 8 }}>
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Votre message…"
                maxLength={300}
                style={{ flex: 1, padding: '9px 13px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.12)', fontSize: 14, outline: 'none', background: 'var(--rr-bg, #fafafa)', color: 'var(--rr-text, #000)' }}
              />
              <button type="submit" disabled={!text.trim()} style={{ background: text.trim() ? '#000' : '#e5e5e5', color: text.trim() ? '#fff' : '#aaa', border: 'none', borderRadius: 12, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: text.trim() ? 'pointer' : 'default', transition: 'background 0.2s' }}>
                <i className="bi bi-send-fill" style={{ fontSize: 14 }} />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default LiveChat;
