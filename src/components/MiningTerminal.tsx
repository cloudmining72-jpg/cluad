import React, { useState, useEffect, useRef } from 'react';
import { stateStore } from '../services/stateStore';
import { Terminal, Cpu, Flame, Activity, Play, Pause } from 'lucide-react';


interface TerminalLog {
  id: string;
  time: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'BLOCK';
  text: string;
}

export const MiningTerminal: React.FC = () => {
  const [, setTick] = useState(0);
  const [isStreaming, setIsStreaming] = useState(true);
  const [temp, setTemp] = useState(62);
  const [fanSpeed, setFanSpeed] = useState(3150);
  const [logs, setLogs] = useState<TerminalLog[]>([
    { id: '1', time: new Date().toLocaleTimeString(), type: 'INFO', text: 'Initializing Cloud ASIC Rig Array Node #PK-8842...' },
    { id: '2', time: new Date().toLocaleTimeString(), type: 'SUCCESS', text: 'Connected to Mining Pool [stratum+tcp://btc.claudexmining-pool.org:3333]' },

    { id: '3', time: new Date().toLocaleTimeString(), type: 'BLOCK', text: 'Difficulty set to 84,219,850,110 GH/s. Target: 00000000000000000003a8c...' },
  ]);

  const logContainerRef = useRef<HTMLDivElement>(null);

  const userActivePlans = stateStore.userPlans.filter((p) => p.userId === stateStore.currentUser.id && p.status === 'ACTIVE');
  const totalHashRate = userActivePlans.length > 0 ? userActivePlans.length * 55 + 25 : 0;

  useEffect(() => {
    const unsub = stateStore.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  // Simulate real-time log terminal output
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      const rand = Math.random();

      // Temperature variation
      setTemp(Math.floor(60 + Math.random() * 8));
      setFanSpeed(Math.floor(3100 + Math.random() * 300));

      let newLog: TerminalLog;

      if (rand > 0.85) {
        const hash = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
        newLog = {
          id: `log-${Date.now()}-${Math.random()}`,
          time,
          type: 'BLOCK',
          text: `⚡ BLOCK SOLVED! Hash: 00000000000000000${hash} [Diff: ${(Math.random() * 50 + 10).toFixed(1)}M]`,
        };
      } else if (rand > 0.5) {
        const shareId = Math.floor(Math.random() * 9000 + 1000);
        const ms = Math.floor(Math.random() * 35 + 12);
        newLog = {
          id: `log-${Date.now()}-${Math.random()}`,
          time,
          type: 'SUCCESS',
          text: `Share #${shareId} accepted (${ms}ms) | Pool Coin Yield credited to balance queue`,
        };
      } else if (rand > 0.3) {
        newLog = {
          id: `log-${Date.now()}-${Math.random()}`,
          time,
          type: 'INFO',
          text: `ASIC Chip Cluster #[${Math.floor(Math.random() * 8 + 1)}] operating nominal. Temp: ${temp}°C, Fan: ${fanSpeed} RPM`,
        };
      } else {
        newLog = {
          id: `log-${Date.now()}-${Math.random()}`,
          time,
          type: 'WARNING',
          text: `Auto-rebalancing frequency tuning... Hashrate locked at ${totalHashRate > 0 ? totalHashRate : 0} TH/s`,
        };
      }

      setLogs((prev) => [...prev.slice(-30), newLog]);

      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isStreaming, temp, fanSpeed, totalHashRate]);

  return (
    <div
      className="card"
      style={{
        backgroundColor: '#0a0e17',
        border: '1px solid #1e293b',
        borderRadius: 14,
        padding: 16,
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',

          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          borderBottom: '1px solid #1e293b',
          paddingBottom: 12,
          marginBottom: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Terminal size={18} color="#06b6d4" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#f3f4f6' }}>
                Live Cloud ASIC Hardware Terminal
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  backgroundColor: totalHashRate > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                  color: totalHashRate > 0 ? '#10b981' : '#9ca3af',
                  padding: '2px 7px',
                  borderRadius: 4,
                  border: `1px solid ${totalHashRate > 0 ? 'rgba(16, 185, 129, 0.4)' : '#374151'}`,
                }}
              >
                {totalHashRate > 0 ? '● ONLINE (MINING)' : '○ IDLE (BUY PLAN)'}
              </span>
            </div>
            <span style={{ fontSize: 11, color: '#64748b', display: 'block' }}>
              Real-Time Stratum Mining Protocol Log & Hardware Telemetry
            </span>
          </div>
        </div>

        {/* Telemetry Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={styles.statPill}>
            <Cpu size={14} color="#06b6d4" />
            <span>
              Hashrate:{' '}
              <strong style={{ color: '#06b6d4', fontFamily: 'var(--font-mono)' }}>
                {totalHashRate} TH/s
              </strong>
            </span>
          </div>

          <div style={styles.statPill}>
            <Flame size={14} color="#f59e0b" />
            <span>
              Temp:{' '}
              <strong style={{ color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                {temp}°C
              </strong>
            </span>
          </div>

          <div style={styles.statPill}>
            <Activity size={14} color="#10b981" />
            <span>
              Fan:{' '}
              <strong style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                {fanSpeed} RPM
              </strong>
            </span>
          </div>

          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className="btn btn-secondary"
            style={{ padding: '5px 10px', fontSize: 11 }}
            title={isStreaming ? 'Pause log stream' : 'Resume log stream'}
          >
            {isStreaming ? <Pause size={12} /> : <Play size={12} />}
            {isStreaming ? 'Pause' : 'Stream'}
          </button>
        </div>
      </div>

      {/* Terminal Output Screen */}
      <div
        ref={logContainerRef}
        style={{
          backgroundColor: '#020617',
          border: '1px solid #1f293d',
          borderRadius: 10,
          padding: 12,
          height: 180,
          overflowY: 'auto',
          fontFamily: 'Consolas, Monaco, "Courier New", monospace',
          fontSize: 12,
          lineHeight: 1.6,
          color: '#38bdf8',
        }}
      >
        {logs.map((log) => {
          let textColor = '#38bdf8';
          if (log.type === 'SUCCESS') textColor = '#4ade80';
          if (log.type === 'BLOCK') textColor = '#facc15';
          if (log.type === 'WARNING') textColor = '#fb923c';

          return (
            <div key={log.id} style={{ display: 'flex', gap: 10, marginBottom: 2 }}>
              <span style={{ color: '#64748b', fontSize: 11, flexShrink: 0 }}>[{log.time}]</span>
              <span style={{ color: textColor }}>{log.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  statPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: 12,
    color: '#94a3b8',
  },
};
