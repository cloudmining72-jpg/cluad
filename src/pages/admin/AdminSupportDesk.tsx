import React, { useState, useEffect } from 'react';
import { stateStore } from '../../services/stateStore';
import { SupportChat } from '../../components/Chat/SupportChat';

export const AdminSupportDesk: React.FC = () => {
  const [, setTick] = useState(0);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const tickets = stateStore.tickets;
  const activeTicket = selectedTicketId
    ? tickets.find((t) => t.id === selectedTicketId) || tickets[0]
    : tickets[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f3f4f6' }}>Admin Live Support Console</h1>
        <span style={{ fontSize: 13, color: '#9ca3af' }}>
          Real-time agent chat stream with registered traders
        </span>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Ticket List */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f3f4f6', marginBottom: 6 }}>
            All Active Tickets ({tickets.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', maxHeight: 440 }}>
            {tickets.map((tkt) => (
              <div
                key={tkt.id}
                onClick={() => setSelectedTicketId(tkt.id)}
                style={{
                  ...styles.ticketItem,
                  backgroundColor: activeTicket?.id === tkt.id ? 'rgba(239, 68, 68, 0.12)' : '#111827',
                  borderColor: activeTicket?.id === tkt.id ? '#ef4444' : '#1f293d',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#f3f4f6' }}>
                    #{tkt.id} — {tkt.userName}
                  </span>
                  <span className={`badge status-${tkt.status}`}>{tkt.status}</span>
                </div>
                <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {tkt.subject}
                </p>
                <span style={{ fontSize: 10, color: '#6b7280' }}>
                  Updated: {new Date(tkt.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Chat Box */}
        <div>
          {activeTicket ? (
            <SupportChat ticket={activeTicket} />
          ) : (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
              Select a ticket to begin agent conversation.
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
};
