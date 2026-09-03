import React from 'react';
import { ShieldCheck, Award, Globe, Cpu, Users, TrendingUp, Clock, Server, Zap } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero Header Card */}
      <div
        className="card"
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#162032',
          border: '1px solid #1f293d',
          borderRadius: 20,
          padding: '32px 24px',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 680 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                padding: '4px 12px',
                borderRadius: 20,
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
              }}
            >
              🏢 OFFICIAL COMPANY PROFILE & INFRASTRUCTURE
            </span>
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            About ClaudeMining Global Inc.
          </h1>

          <p style={{ fontSize: 14, color: '#9ca3af', marginTop: 12, lineHeight: 1.6 }}>
            ClaudeMining is a premier global cloud cryptocurrency mining infrastructure provider. Over the past <strong style={{ color: '#06b6d4' }}>5 years</strong>, we have built next-generation ASIC server farms powered by 100% renewable energy, delivering daily 24-hour mining yields to over 1.25 million investors across 48+ countries.
          </p>

          <div style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#10b981', fontWeight: 700 }}>
              <ShieldCheck size={18} color="#10b981" /> FinCEN MSB Licensed #31000284
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#06b6d4', fontWeight: 700 }}>
              <Award size={18} color="#06b6d4" /> ISO/IEC 27001 Certified
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#f59e0b', fontWeight: 700 }}>
              <Globe size={18} color="#f59e0b" /> 6 Months Regional Gateway in Pakistan
            </div>
          </div>
        </div>

        {/* Datacenter Banner Image */}
        <div style={{ marginTop: 24, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
          <img
            src="/datacenter.jpg"
            alt="ClaudeMining Global ASIC Mining Facility"
            style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              backgroundColor: 'rgba(10, 14, 23, 0.85)',
              backdropFilter: 'blur(8px)',
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Server size={16} color="#06b6d4" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>
              Reykjavik Tier-4 Hydro ASIC Datacenter (120 MW Capacity)
            </span>
          </div>
        </div>
      </div>

      {/* 4 Company Core Statistics Cards */}
      <div className="grid-4">
        <div className="card" style={styles.statCard}>
          <div style={{ ...styles.iconBox, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={styles.statLabel}>Global Operations</span>
            <h2 className="mono" style={styles.statValue}>5 Years</h2>
            <span style={styles.statSub}>Established in 2021 in UK & USA</span>
          </div>
        </div>

        <div className="card" style={styles.statCard}>
          <div style={{ ...styles.iconBox, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <span style={styles.statLabel}>Total Investor Payouts</span>
            <h2 className="mono" style={{ ...styles.statValue, color: '#10b981' }}>$184.5M+</h2>
            <span style={styles.statSub}>100% 24h cycle payouts honored</span>
          </div>
        </div>

        <div className="card" style={styles.statCard}>
          <div style={{ ...styles.iconBox, backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Users size={24} />
          </div>
          <div>
            <span style={styles.statLabel}>Active Global Users</span>
            <h2 className="mono" style={{ ...styles.statValue, color: '#06b6d4' }}>1,250,000+</h2>
            <span style={styles.statSub}>Across 48 countries worldwide</span>
          </div>
        </div>

        <div className="card" style={styles.statCard}>
          <div style={{ ...styles.iconBox, backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Globe size={24} />
          </div>
          <div>
            <span style={styles.statLabel}>Pakistan Operations</span>
            <h2 className="mono" style={{ ...styles.statValue, color: '#f59e0b' }}>6 Months</h2>
            <span style={styles.statSub}>Dedicated local servers & support</span>
          </div>
        </div>
      </div>

      {/* Company Story & Regional Focus */}
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Cpu size={22} color="#06b6d4" />
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6', margin: 0 }}>
              5-Year Global Journey (2021 - 2026)
            </h3>
          </div>
          <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>
            Founded in 2021, ClaudeMining set out to revolutionize cloud mining by removing expensive hardware setup costs and technical maintenance for everyday investors. Over the last 5 years, our engineering team deployed over 250,000 high-efficiency Bitmain Antminer S19 Pro and S21 Hydro rigs across Iceland, Norway, and Chicago.
          </p>
          <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>
            By utilizing low-cost geothermal and hydroelectric power, we maintain an industry-leading profit margin, allowing us to deliver steady daily profits to our global investor community with zero equipment downtime.
          </p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap size={22} color="#f59e0b" />
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6', margin: 0 }}>
              6 Months Expansion in Pakistan
            </h3>
          </div>
          <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>
            Over the past 6 months, ClaudeMining has established a dedicated regional operational presence in Pakistan to cater to the rapidly growing South Asian investor market.
          </p>
          <ul style={{ paddingLeft: 18, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#d1d5db' }}>
            <li>⚡ <strong>Localized Fast Gateway</strong>: Direct low-fee crypto & USDT deposit/withdrawal routing.</li>
            <li>🇵🇰 <strong>24/7 Urdu & English Support</strong>: Dedicated regional helpdesk officers.</li>
            <li>🔒 <strong>Fast $1.00 Flat Fee Withdrawals</strong>: Minimum withdrawal starting from just $20.00.</li>
            <li>🎁 <strong>$5,000 Trial Bonus Cash</strong>: Instant trial capital for all newly registered Pakistani users.</li>
          </ul>
        </div>
      </div>

      {/* Global Datacenter Facilities Grid */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6', margin: 0 }}>
          🌐 Global Mining Datacenters & Infrastructure
        </h3>

        <div className="grid-3">
          <div style={styles.facilityBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 800, color: '#f3f4f6', fontSize: 14 }}>🇮🇸 Reykjavik, Iceland</span>
              <span className="badge status-APPROVED">120 MW</span>
            </div>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>100% Geothermal & Hydro powered. Houses 65,000 Antminer S21 Hydro rigs.</p>
          </div>

          <div style={styles.facilityBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 800, color: '#f3f4f6', fontSize: 14 }}>🇳🇴 Oslo, Norway</span>
              <span className="badge status-APPROVED">85 MW</span>
            </div>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Sub-zero liquid cooling facility with 45,000 high-efficiency BTC mining nodes.</p>
          </div>

          <div style={styles.facilityBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 800, color: '#f3f4f6', fontSize: 14 }}>🇺🇸 Chicago, USA</span>
              <span className="badge status-APPROVED">250 MW</span>
            </div>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Solar & wind energy grid powered. Headquarters located at Chicago 266 St.</p>
          </div>

          <div style={styles.facilityBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 800, color: '#f3f4f6', fontSize: 14 }}>🇦🇪 Dubai, UAE</span>
              <span className="badge status-APPROVED">Global Hub</span>
            </div>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Middle East financial management & Institutional liquidity desk.</p>
          </div>

          <div style={styles.facilityBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 800, color: '#f3f4f6', fontSize: 14 }}>🇵🇰 Pakistan Regional Gateway</span>
              <span className="badge status-APPROVED">Active (6 Mos)</span>
            </div>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Regional API relay nodes & 24/7 dedicated Urdu client support desk.</p>
          </div>

          <div style={styles.facilityBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 800, color: '#f3f4f6', fontSize: 14 }}>🇩🇪 Frankfurt, Germany</span>
              <span className="badge status-APPROVED">EU Relay</span>
            </div>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>High-security backup server infrastructure and European compliance center.</p>
          </div>
        </div>
      </div>

      {/* Company Roadmap Timeline */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6', margin: 0 }}>
          🚀 Corporate Milestone Timeline
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', paddingLeft: 20, borderLeft: '2px solid #1f293d' }}>
          <div style={styles.timelineItem}>
            <div style={styles.timelineDot} />
            <span style={{ fontWeight: 800, color: '#06b6d4', fontSize: 13 }}>2021 — Global Launch</span>
            <h4 style={{ color: '#f3f4f6', margin: '4px 0', fontSize: 15 }}>Incorporation & First Datacenter</h4>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>ClaudeMining launched in London & Chicago with 10,000 mining units.</p>
          </div>

          <div style={styles.timelineItem}>
            <div style={styles.timelineDot} />
            <span style={{ fontWeight: 800, color: '#10b981', fontSize: 13 }}>2022 — $50M Profit Milestone</span>
            <h4 style={{ color: '#f3f4f6', margin: '4px 0', fontSize: 15 }}>Iceland Geothermal Facility</h4>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Expanded to Iceland and reached $50M total investor payouts.</p>
          </div>

          <div style={styles.timelineItem}>
            <div style={styles.timelineDot} />
            <span style={{ fontWeight: 800, color: '#3b82f6', fontSize: 13 }}>2024 — 1 Million Users</span>
            <h4 style={{ color: '#f3f4f6', margin: '4px 0', fontSize: 15 }}>ASIC Hydro Cooling Deployment</h4>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Upgraded full hardware fleet to S19/S21 Hydro rigs with zero downtime.</p>
          </div>

          <div style={styles.timelineItem}>
            <div style={{ ...styles.timelineDot, backgroundColor: '#f59e0b' }} />
            <span style={{ fontWeight: 800, color: '#f59e0b', fontSize: 13 }}>Late 2025 (6 Months Ago) — Pakistan Expansion</span>
            <h4 style={{ color: '#f3f4f6', margin: '4px 0', fontSize: 15 }}>Launch of South Asia Regional Gateway</h4>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Established local support operations and low-fee gateway for Pakistan users.</p>
          </div>

          <div style={styles.timelineItem}>
            <div style={{ ...styles.timelineDot, backgroundColor: '#10b981' }} />
            <span style={{ fontWeight: 800, color: '#10b981', fontSize: 13 }}>2026 (Present) — $184.5M Payouts & 24h Cycle Engine</span>
            <h4 style={{ color: '#f3f4f6', margin: '4px 0', fontSize: 15 }}>ClaudeMining 2.0 Web Platform</h4>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Rolled out 24-hour mandatory claim cycles, multi-coin selector, and 2-level referral commissions.</p>
          </div>
        </div>
      </div>

      {/* Leadership & Executive Board */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6', margin: 0 }}>
          👨‍💼 Executive Leadership Team
        </h3>

        <div className="grid-4">
          <div style={styles.teamCard}>
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80" alt="CEO" style={styles.teamImg} />
            <h4 style={{ color: '#f3f4f6', margin: '8px 0 2px 0', fontSize: 14 }}>BJ Gelinas</h4>
            <span style={{ fontSize: 11, color: '#06b6d4', fontWeight: 700 }}>Founder & Chief Executive Officer</span>
            <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, margin: 0 }}>15+ years experience in institutional energy grid management & crypto mining.</p>
          </div>

          <div style={styles.teamCard}>
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" alt="CTO" style={styles.teamImg} />
            <h4 style={{ color: '#f3f4f6', margin: '8px 0 2px 0', fontSize: 14 }}>Dr. Elena Rostova</h4>
            <span style={{ fontSize: 11, color: '#06b6d4', fontWeight: 700 }}>Chief Technology Officer</span>
            <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, margin: 0 }}>Former senior ASIC hardware architect & distributed blockchain systems expert.</p>
          </div>

          <div style={styles.teamCard}>
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" alt="Support Head" style={styles.teamImg} />
            <h4 style={{ color: '#f3f4f6', margin: '8px 0 2px 0', fontSize: 14 }}>Sarah Miller</h4>
            <span style={{ fontSize: 11, color: '#06b6d4', fontWeight: 700 }}>Head of Global Client Operations</span>
            <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, margin: 0 }}>Leads 24/7 multi-lingual customer support desks across 4 continents.</p>
          </div>

          <div style={styles.teamCard}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" alt="Regional Director" style={styles.teamImg} />
            <h4 style={{ color: '#f3f4f6', margin: '8px 0 2px 0', fontSize: 14 }}>Tariq Mehmood</h4>
            <span style={{ fontSize: 11, color: '#06b6d4', fontWeight: 700 }}>Regional Director (Pakistan Operations)</span>
            <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6, margin: 0 }}>Manages 6-month Pakistan operational growth, localized gateways & support.</p>
          </div>
        </div>
      </div>

      {/* Official Inquiries & Corporate Contact */}
      <div className="card" style={{ backgroundColor: '#162032', border: '1px solid #1f293d', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f3f4f6', margin: 0 }}>
          📫 Official Inquiries & Communication
        </h3>
        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
          For corporate partnerships, institutional investments, compliance verification, and official inquiries, please contact our global desk:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginTop: 8 }}>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f293d', padding: '14px 16px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>💬</span>
            <div>
              <span style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>24/7 Customer Support</span>
              <a href="mailto:support@claudemining.com" style={{ fontSize: 13, color: '#10b981', fontWeight: 700, textDecoration: 'none' }}>support@claudemining.com</a>
            </div>
          </div>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f293d', padding: '14px 16px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>📧</span>
            <div>
              <span style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>General & Partnerships</span>
              <a href="mailto:info@claudemining.com" style={{ fontSize: 13, color: '#06b6d4', fontWeight: 700, textDecoration: 'none' }}>info@claudemining.com</a>
            </div>
          </div>
          <div style={{ backgroundColor: '#111827', border: '1px solid #1f293d', padding: '14px 16px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🌐</span>
            <div>
              <span style={{ fontSize: 11, color: '#9ca3af', display: 'block' }}>Official Domain</span>
              <span style={{ fontSize: 13, color: '#f3f4f6', fontWeight: 700 }}>claudemining.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#162032',
    border: '1px solid #1f293d',
    borderRadius: 14,
    padding: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 800,
    color: '#f3f4f6',
    margin: '2px 0',
  },
  statSub: {
    fontSize: 10,
    color: '#6b7280',
  },
  facilityBox: {
    backgroundColor: '#111827',
    border: '1px solid #1f293d',
    borderRadius: 12,
    padding: 14,
  },
  timelineItem: {
    position: 'relative',
    paddingBottom: 10,
  },
  timelineDot: {
    position: 'absolute',
    left: -26,
    top: 4,
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: '#06b6d4',
  },
  teamCard: {
    backgroundColor: '#111827',
    border: '1px solid #1f293d',
    borderRadius: 14,
    padding: 16,
    textAlign: 'center',
  },
  teamImg: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '0 auto',
    border: '2px solid #06b6d4',
  },
};
