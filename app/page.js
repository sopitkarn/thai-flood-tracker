'use client';

import Link from 'next/link';
import { Map, AlertTriangle, ShieldAlert, Waves } from 'lucide-react';

export default function HomePage() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
          <Waves size={40} color="#0284c7" />
          <h1 style={{ fontSize: '2rem', color: '#0f172a' }}>
            Thai Flood Tracker - ระบบติดตามสถานการณ์น้ำท่วม
          </h1>
        </div>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          ติดตามสถานการณ์น้ำท่วม แจ้งขอความช่วยเหลือ และบริหารจัดการข้อมูลกู้ภัยแบบ Real-time
        </p>
      </header>

      <nav style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <Link href="/flood-map" style={cardStyle}>
          <Map size={36} color="#0284c7" />
          <h2 style={titleStyle}>แผนที่ติดตามน้ำท่วม</h2>
          <p style={descStyle}>ดูพื้นที่เสี่ยงภัยและระดับน้ำในพื้นที่ต่างๆ</p>
        </Link>

        <Link href="/report-incident" style={cardStyle}>
          <AlertTriangle size={36} color="#e11d48" />
          <h2 style={titleStyle}>แจ้งขอความช่วยเหลือ</h2>
          <p style={descStyle}>ส่งพิกัดและรายละเอียดผู้ประสบภัยทันที</p>
        </Link>

        <Link href="/control-room" style={cardStyle}>
          <ShieldAlert size={36} color="#d97706" />
          <h2 style={titleStyle}>ศูนย์ควบคุมกู้ภัย</h2>
          <p style={descStyle}>สำหรับเจ้าหน้าที่จัดการและประสานงานเคส</p>
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
  border: '1px solid #e2e8f0',
  borderRadius: '0.75rem',
  textDecoration: 'none',
  color: 'inherit',
  backgroundColor: '#ffffff',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  textAlign: 'center',
  transition: 'transform 0.2s, box-shadow 0.2s'
};

const titleStyle = {
  fontSize: '1.25rem',
  marginTop: '1rem',
  marginBottom: '0.5rem',
  color: '#1e293b'
};

const descStyle = {
  fontSize: '0.875rem',
  color: '#64748b',
  margin: 0
};
