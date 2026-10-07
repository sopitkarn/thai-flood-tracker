'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function ControlRoomPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <Link href="/" style={{ color: '#2563eb', textDecoration: 'none' }}>← กลับหน้าหลัก</Link>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: '#059669' }}>
        <ShieldAlert color="#059669" /> ศูนย์ควบคุมกู้ภัย (Control Room)
      </h1>
      <p style={{ color: '#64748b' }}>รายการคำร้องขอความช่วยเหลือและสถานะการดำเนินการ</p>
    </div>
  );
}
