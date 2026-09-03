import React, { useState, useEffect } from 'react';
import { stateStore } from '../../services/stateStore';

export const AuditLogsPage: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return stateStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const logs = stateStore.auditLogs;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#f3f4f6' }}>Audit & Compliance Ledger</h1>
        <span style={{ fontSize: 13, color: '#9ca3af' }}>
          Immutable logging of every administrative action, deposit/withdrawal approval, and compliance state change
        </span>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Operator</th>
                <th>Action Type</th>
                <th>Event Description</th>
                <th>Timestamp</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#9ca3af', padding: 20 }}>No audit logs recorded yet.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td className="mono" style={{ fontSize: 11 }}>{log.id}</td>
                    <td style={{ fontWeight: 700, fontSize: 12, color: '#f3f4f6' }}>{log.actionBy}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: '#111827', color: '#3b82f6', border: '1px solid #1f293d' }}>
                        {log.actionType}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: '#9ca3af' }}>{log.details}</td>
                    <td style={{ fontSize: 11, color: '#6b7280' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="mono" style={{ fontSize: 11, color: '#06b6d4' }}>{log.ipAddress}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
