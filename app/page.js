'use client';

import Link from 'next/link';
import { Map, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function HomePage() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', color: '#1e3a8a', marginBottom: '0.5rem' }}>
          Thai Flood Tracker
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#475569' }}>
          ระบบติดตามสถานการณ์น้ำท่วมและประสานงานความช่วยเหลือ
        </p>
      </header>

      <nav style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <Link href="/flood-map" style={cardStyle}>
          <Map size={48} color="#2563eb" />
          <h2 style={titleStyle}>แผนที่ติดตามน้ำท่วม</h2>
          <p style={descStyle}>ดูระดับน้ำและพื้นที่เสี่ยงภัยแบบเรียลไทม์</p>
        </Link>

        <Link href="/report-incident" style={cardStyle}>
          <AlertTriangle size={48} color="#dc2626" />
          <h2 style={titleStyle}>แจ้งขอความช่วยเหลือ</h2>
          <p style={descStyle}>แจ้งเหตุ ส่งพิกัด และขอความช่วยเหลือด่วน</p>
        </Link>

        <Link href="/control-room" style={cardStyle}>
          <ShieldAlert size={48} color="#059669" />
          <h2 style={titleStyle}>ศูนย์ควบคุมกู้ภัย</h2>
          <p style={descStyle}>สำหรับเจ้าหน้าที่บริหารจัดการความช่วยเหลือ</p>
        </Link>
      </nav>
    </main>
  );
}

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1.5rem',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'transform 0.2s, box-shadow 0.2s',
};

const titleStyle = {
  fontSize: '1.25rem',
  margin: '1rem 0 0.5rem 0',
  color: '#0f172a',
};

const descStyle = {
  fontSize: '0.9rem',
  color: '#64748b',
  margin: 0,
};
