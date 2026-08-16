import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Trash2, 
  Reply, 
  X, 
  MessageSquare, 
  Eye, 
  Smile,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../utils/sounds';
import { socket } from '../utils/socket';

export default function LiveChat({
  roomPin = '',
  currentUser,
  isHost = false,
  isSpectator = false,
  onClose = null
}) {
  const [messages, setMessages] = useState(() => {
    return [
      {
        id: 'msg_welcome',
        senderId: 'system',
        senderName: 'KAHOTBEK BOT',
        senderAvatar: '🤖',
        text: 'Jonli chatga xush kelibsiz! O\'yinchilar va kuzatuvchilar bilan fikr almashing.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // { id, senderName, text }
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket chat listeners
  useEffect(() => {
    const handleNewMessage = (msg) => {
      soundManager.playClick();
      setMessages((prev) => [...prev, msg]);
    };

    const handleDeleteMessage = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    };

    socket.on('chat_message', handleNewMessage);
    socket.on('chat_message_deleted', handleDeleteMessage);

    return () => {
      socket.off('chat_message', handleNewMessage);
      socket.off('chat_message_deleted', handleDeleteMessage);
    };
  }, []);

  // Send message
  const handleSendMessage = (e) => {
    e?.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    soundManager.playClick();

    const newMsg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      roomPin: roomPin || 'global',
      senderId: currentUser.id || socket.id || 'user',
      senderName: currentUser.name || 'Bilimdon',
      senderAvatar: currentUser.avatar || '🦁',
      senderRole: isHost ? 'HOST' : (isSpectator ? 'VIEWER' : 'PLAYER'),
      text,
      replyTo: replyingTo ? {
        id: replyingTo.id,
        senderName: replyingTo.senderName,
        text: replyingTo.text.length > 40 ? replyingTo.text.slice(0, 40) + '...' : replyingTo.text
      } : null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Emit to socket room
    socket.emit('send_chat_message', {
      pin: roomPin,
      message: newMsg
    });

    // Local update
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setReplyingTo(null);
  };

  // Delete message (No edit allowed, only delete)
  const handleDelete = (msgId) => {
    soundManager.playClick();
    socket.emit('delete_chat_message', {
      pin: roomPin,
      messageId: msgId
    });

    setMessages((prev) => prev.filter((m) => m.id !== msgId));
  };

  // Quick Emoji reactions
  const sendEmoji = (emoji) => {
    setInputText((prev) => prev + emoji);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#121826',
      border: '1px solid #1e283d',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Chat Header */}
      <div style={{
        padding: '12px 16px',
        background: '#182234',
        borderBottom: '1px solid #222d42',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={16} color="#38bdf8" />
          <span style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff' }}>
            Jonli Chat
          </span>
          {isSpectator && (
            <span style={{
              fontSize: '10px',
              fontWeight: '800',
              padding: '2px 6px',
              borderRadius: '6px',
              background: '#1e293b',
              color: '#38bdf8',
              border: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Eye size={10} /> KUZATUVCHI
            </span>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: '#94a3b8', padding: '4px' }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {messages.map((msg) => {
          const isMe = msg.senderId === (currentUser.id || socket.id);
          const isSystem = msg.isSystem;

          if (isSystem) {
            return (
              <div key={msg.id} style={{
                background: '#0e1422',
                border: '1px solid #1e283d',
                padding: '8px 12px',
                borderRadius: '10px',
                fontSize: '11px',
                color: '#94a3b8',
                textAlign: 'center',
                lineHeight: 1.4
              }}>
                🤖 {msg.text}
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start',
                gap: '2px'
              }}
            >
              {/* Sender info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                color: '#94a3b8',
                marginBottom: '2px',
                padding: '0 4px'
              }}>
                <span>{msg.senderAvatar}</span>
                <span style={{ fontWeight: '700', color: isMe ? '#818cf8' : '#f8fafc' }}>
                  {msg.senderName} {isMe && '(Siz)'}
                </span>
                {msg.senderRole === 'HOST' && (
                  <span style={{ fontSize: '9px', background: '#f59e0b', color: '#000', padding: '1px 4px', borderRadius: '4px', fontWeight: '800' }}>
                    HOST
                  </span>
                )}
                {msg.senderRole === 'VIEWER' && (
                  <span style={{ fontSize: '9px', background: '#0284c7', color: '#fff', padding: '1px 4px', borderRadius: '4px', fontWeight: '800' }}>
                    VIEW
                  </span>
                )}
                <span style={{ fontSize: '10px', opacity: 0.7 }}>{msg.timestamp}</span>
              </div>

              {/* Message Bubble with Reply preview */}
              <div style={{
                maxWidth: '85%',
                background: isMe ? '#4f46e5' : '#1c273c',
                color: '#ffffff',
                padding: '8px 12px',
                borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                fontSize: '13px',
                lineHeight: 1.4,
                position: 'relative',
                wordBreak: 'break-word',
                border: isMe ? 'none' : '1px solid #283652'
              }}>
                {/* Reply Quote preview */}
                {msg.replyTo && (
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    borderLeft: '3px solid #38bdf8',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginBottom: '6px',
                    fontSize: '11px',
                    color: '#e2e8f0'
                  }}>
                    <div style={{ fontWeight: '800', color: '#38bdf8' }}>{msg.replyTo.senderName}</div>
                    <div style={{ opacity: 0.9 }}>{msg.replyTo.text}</div>
                  </div>
                )}

                <div>{msg.text}</div>

                {/* Actions: Reply and Delete */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '6px',
                  marginTop: '4px',
                  paddingTop: '2px'
                }}>
                  {/* Reply Button */}
                  <button
                    onClick={() => setReplyingTo(msg)}
                    style={{
                      background: 'transparent',
                      color: isMe ? '#c7d2fe' : '#94a3b8',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      fontSize: '10px',
                      fontWeight: '700'
                    }}
                    title="Javob berish"
                  >
                    <Reply size={11} />
                    <span>Javob</span>
                  </button>

                  {/* Delete Button (Allowed for own messages or Host) */}
                  {(isMe || isHost) && (
                    <button
                      onClick={() => handleDelete(msg.id)}
                      style={{
                        background: 'transparent',
                        color: isMe ? '#fca5a5' : '#ef4444',
                        padding: '2px'
                      }}
                      title="O'chirish"
                    >
                      <Trash2 size={11} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Banner */}
      {replyingTo && (
        <div style={{
          padding: '6px 12px',
          background: '#182234',
          borderTop: '1px solid #222d42',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
            <Reply size={12} color="#38bdf8" />
            <span style={{ color: '#38bdf8', fontWeight: '800' }}>{replyingTo.senderName}:</span>
            <span style={{ color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {replyingTo.text}
            </span>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            style={{ background: 'transparent', color: '#94a3b8', padding: '2px' }}
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Quick Emoji Bar */}
      <div style={{
        display: 'flex',
        gap: '6px',
        padding: '6px 12px',
        background: '#0e1422',
        borderTop: '1px solid #1e283d',
        overflowX: 'auto'
      }}>
        {['🔥', '👏', '⚡', '🎯', '😂', '👑', '🎉'].map((em) => (
          <button
            key={em}
            type="button"
            onClick={() => sendEmoji(em)}
            style={{
              background: '#182234',
              border: '1px solid #222d42',
              borderRadius: '6px',
              padding: '2px 6px',
              fontSize: '13px'
            }}
          >
            {em}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} style={{
        padding: '10px 12px',
        background: '#121826',
        borderTop: '1px solid #1e283d',
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder={replyingTo ? `${replyingTo.senderName}ga javob...` : "Xabar yozing..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          maxLength={150}
          style={{
            flex: 1,
            background: '#0e1422',
            border: '1px solid #222d42',
            borderRadius: '10px',
            padding: '8px 12px',
            color: '#ffffff',
            fontSize: '13px'
          }}
        />
        <button
          type="submit"
          className="btn-solid-primary"
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            fontSize: '13px'
          }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
