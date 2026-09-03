import React, { useState, useEffect, useRef } from 'react';
import type { SupportTicket } from '../../types';
import { stateStore } from '../../services/stateStore';
import { Send, User, Shield, CheckCircle, Paperclip, FileText, Image as ImageIcon, Download, X } from 'lucide-react';

interface SupportChatProps {
  ticket: SupportTicket;
}

export const SupportChat: React.FC<SupportChatProps> = ({ ticket }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ url: string; name: string; type: 'IMAGE' | 'DOCUMENT' | 'PDF' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isUser = stateStore.currentRole === 'USER';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket.messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    const fakeUrl = URL.createObjectURL(file);

    setSelectedFile({
      url: fakeUrl,
      name: file.name,
      type: isImage ? 'IMAGE' : isPdf ? 'PDF' : 'DOCUMENT',
    });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() && !selectedFile) return;

    stateStore.sendSupportMessage(
      ticket.id,
      inputMessage.trim() || (selectedFile ? `Sent document attachment: ${selectedFile.name}` : ''),
      selectedFile || undefined
    );

    setInputMessage('');
    setSelectedFile(null);
  };

  return (
    <div style={styles.chatCard}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#f3f4f6' }}>
              Ticket #{ticket.id}
            </span>
            <span className={`badge status-${ticket.status}`}>
              {ticket.status}
            </span>
            <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>
              Priority: {ticket.priority}
            </span>
          </div>
          <span style={{ fontSize: 13, color: '#9ca3af', marginTop: 4, display: 'block' }}>
            {ticket.subject}
          </span>
        </div>

        {/* Admin actions if viewing from Admin Desk */}
        {!isUser && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => stateStore.updateTicketStatus(ticket.id, 'IN_PROGRESS')}
              style={styles.adminActionBtn}
            >
              In Progress
            </button>
            <button
              onClick={() => stateStore.updateTicketStatus(ticket.id, 'RESOLVED')}
              style={{ ...styles.adminActionBtn, backgroundColor: '#10b981', color: '#000' }}
            >
              Resolve Ticket
            </button>
          </div>
        )}
      </div>

      {/* Messages Stream */}
      <div style={styles.messageStream}>
        {ticket.messages.map((msg) => {
          const isMe = isUser ? msg.senderType === 'USER' : msg.senderType === 'ADMIN';

          return (
            <div
              key={msg.id}
              style={{
                ...styles.messageRow,
                justifyContent: isMe ? 'flex-end' : 'flex-start',
              }}
            >
              {!isMe && (
                <div style={styles.avatarCircle}>
                  {msg.senderType === 'ADMIN' ? (
                    <img
                      src={msg.agentAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                      alt="Support Representative"
                      style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <User size={14} color="#3b82f6" />
                  )}
                </div>
              )}

              <div
                style={{
                  ...styles.bubble,
                  ...(isMe ? styles.bubbleMe : styles.bubbleOther),
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 800, fontSize: 11, color: isMe ? '#ffffff' : '#06b6d4' }}>
                    {msg.senderType === 'ADMIN'
                      ? (msg.agentAlias || msg.senderName || 'Sarah Miller (Support Officer)')
                      : msg.senderName}
                  </span>
                  <span style={{ fontSize: 10, opacity: 0.7 }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {msg.message && <p style={{ margin: 0, fontSize: 13, lineHeight: 1.4 }}>{msg.message}</p>}

                {/* Render File / Document Attachment if Present */}
                {msg.attachmentUrl && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: 10,
                      borderRadius: 8,
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    {msg.attachmentType === 'IMAGE' ? (
                      <ImageIcon size={18} color="#10b981" />
                    ) : (
                      <FileText size={18} color="#06b6d4" />
                    )}
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {msg.attachmentName || 'Attached Document'}
                      </span>
                      <span style={{ fontSize: 10, opacity: 0.8 }}>
                        {msg.attachmentType || 'DOCUMENT'}
                      </span>
                    </div>
                    <a
                      href={msg.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: '#000000',
                        backgroundColor: '#10b981',
                        padding: '4px 8px',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        textDecoration: 'none',
                      }}
                    >
                      <Download size={12} /> View/Download
                    </a>
                  </div>
                )}
              </div>

              {isMe && (
                <div style={{ ...styles.avatarCircle, backgroundColor: '#3b82f6' }}>
                  {isUser ? <User size={14} color="#fff" /> : <Shield size={14} color="#fff" />}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected File Attachment Preview Badge */}
      {selectedFile && (
        <div style={{ padding: '6px 14px', backgroundColor: '#111827', borderTop: '1px solid #1f293d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={14} color="#10b981" />
            <span style={{ fontSize: 12, color: '#10b981', fontWeight: 700 }}>
              Attached File: {selectedFile.name}
            </span>
          </div>
          <button onClick={() => setSelectedFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
            <X size={14} color="#ef4444" />
          </button>
        </div>
      )}

      {/* Input Footer */}
      {ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? (
        <div style={styles.closedFooter}>
          <CheckCircle size={16} color="#10b981" />
          <span>This ticket has been marked as {ticket.status}. Reopen by sending a message if needed.</span>
        </div>
      ) : (
        <form onSubmit={handleSend} style={styles.inputBar}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{ ...styles.sendBtn, backgroundColor: '#162032', border: '1px solid #1f293d', color: '#9ca3af' }}
            title="Attach Document or Image"
          >
            <Paperclip size={16} color="#06b6d4" />
          </button>

          <input
            type="text"
            placeholder={isUser ? "Type response or attach document..." : "Type reply to customer..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            style={styles.chatInput}
          />
          <button type="submit" style={styles.sendBtn}>
            <Send size={16} /> Send
          </button>
        </form>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  chatCard: {
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    height: 480,
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
  },
  header: {
    padding: '14px 18px',
    borderBottom: '1px solid #1f293d',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  adminActionBtn: {
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 700,
    backgroundColor: '#1f293d',
    color: '#f3f4f6',
  },
  messageStream: {
    flex: 1,
    padding: 16,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    backgroundColor: '#0a0e17',
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 8,
  },
  avatarCircle: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '75%',
    padding: '10px 14px',
    borderRadius: 12,
    color: '#f3f4f6',
  },
  bubbleMe: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 2,
  },
  bubbleOther: {
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderBottomLeftRadius: 2,
  },
  inputBar: {
    padding: 12,
    borderTop: '1px solid #1f293d',
    display: 'flex',
    gap: 8,
    backgroundColor: '#111827',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: '8px 12px',
    color: '#f3f4f6',
    fontSize: 13,
  },
  sendBtn: {
    padding: '8px 16px',
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    color: '#fff',
    fontWeight: 700,
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  closedFooter: {
    padding: 12,
    backgroundColor: '#111827',
    borderTop: '1px solid #1f293d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontSize: 12,
    color: '#9ca3af',
  },
};
