'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function FloodMapPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Link href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>← กลับหน้าหลัก</Link>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
        <MapPin color="#2563eb" /> แผนที่ติดตามน้ำท่วม (Flood Map)
      </h1>
      <p style={{ color: '#64748b' }}>แสดงข้อมูลระดับน้ำและพื้นที่เฝ้าระวัง</p>
    </div>
  );
}
