'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function ReportIncidentPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>← กลับหน้าหลัก</Link>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: '#dc2626' }}>
        <AlertTriangle color="#dc2626" /> แจ้งขอความช่วยเหลือ (Report Incident)
      </h1>
      <p style={{ color: '#64748b' }}>กรอกข้อมูลพื้นที่และระดับความเดือดร้อนเพื่อประสานงานเจ้าหน้าที่</p>
    </div>
  );
}
