import React, { useState, useEffect } from 'react';
import { stateStore } from '../../services/stateStore';
import type { SupportTicketPriority } from '../../types';
import { SupportChat } from '../../components/Chat/SupportChat';
import { PlusCircle } from 'lucide-react';

export const SupportPage: React.FC = () => {
  const [, setTick] = useState(0);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<SupportTicketPriority>('MEDIUM');
  const [message, setMessage] = useState('');

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const currentUser = stateStore.currentUser;
  const userTickets = stateStore.tickets.filter((t) => t.userId === currentUser.id);

  const activeTicket = selectedTicketId
    ? userTickets.find((t) => t.id === selectedTicketId) || userTickets[0]
    : userTickets[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    stateStore.createTicket(subject, priority, message);
    setShowNewModal(false);
    setSubject('');
    setMessage('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f3f4f6' }}>24/7 Customer Support Desk</h1>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>
            Real-time chat with compliance officers and trading specialists
          </span>
        </div>

        <button onClick={() => setShowNewModal(true)} className="btn btn-primary">
          <PlusCircle size={16} /> Open New Support Ticket
        </button>
      </div>

      {showNewModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6', marginBottom: 16 }}>
              Create Support Ticket
            </h3>
            <form onSubmit={handleCreateTicket}>
              <div style={{ marginBottom: 12 }}>
                <label style={styles.label}>Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Deposit clearance or Strategy inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={styles.label}>Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  style={styles.select}
                >
                  <option value="LOW">Low - General Question</option>
                  <option value="MEDIUM">Medium - Financial Inquiry</option>
                  <option value="HIGH">High - Urgent Assistance</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={styles.label}>Initial Message</label>
                <textarea
                  rows={4}
                  placeholder="Describe your issue in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ ...styles.input, resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Submit Ticket
                </button>
                <button type="button" onClick={() => setShowNewModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Support Grid: Ticket List + Live Chat Box */}
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Ticket List */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f3f4f6', marginBottom: 6 }}>
            Your Conversations ({userTickets.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', maxHeight: 420 }}>
            {userTickets.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af' }}>No support tickets created.</div>
            ) : (
              userTickets.map((tkt) => (
                <div
                  key={tkt.id}
                  onClick={() => setSelectedTicketId(tkt.id)}
                  style={{
                    ...styles.ticketItem,
                    backgroundColor: activeTicket?.id === tkt.id ? 'rgba(59, 130, 246, 0.12)' : '#111827',
                    borderColor: activeTicket?.id === tkt.id ? '#3b82f6' : '#1f293d',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#f3f4f6' }}>Ticket #{tkt.id}</span>
                    <span className={`badge status-${tkt.status}`}>{tkt.status}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 6px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {tkt.subject}
                  </p>
                  <span style={{ fontSize: 10, color: '#6b7280' }}>
                    Updated: {new Date(tkt.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Chat Box */}
        <div>
          {activeTicket ? (
            <SupportChat ticket={activeTicket} />
          ) : (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
              Select a ticket on the left to start live messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  ticketItem: {
    padding: 12,
    borderRadius: 8,
    border: '1px solid #1f293d',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 14, 23, 0.85)',
    backdropFilter: 'blur(6px)',
    zIndex: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 440,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#9ca3af',
    marginBottom: 4,
    display: 'block',
  },
  input: {
    width: '100%',
    backgroundColor: '#111827',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: '10px 12px',
    color: '#f3f4f6',
    fontSize: 13,
  },
  select: {
    width: '100%',
    backgroundColor: '#111827',
    border: '1px solid #1f293d',
    borderRadius: 8,
    padding: '10px 12px',
    color: '#f3f4f6',
    fontSize: 13,
  },
};
