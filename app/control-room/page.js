'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import {
  ArrowLeft,
  ShieldAlert,
  Clock,
  Phone,
  MapPin,
  Users,
  Droplets,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Radio
} from 'lucide-react';

export default function ControlRoomPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // ดึงรายการเคสทั้งหมด
  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('flood_incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setIncidents(data || []);
    } catch (err) {
      console.error('Error fetching incidents:', err);
      setError('ไม่สามารถโหลดข้อมูลเหตุฉุกเฉินได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();

    // ตั้งค่า Realtime Channel ฟังการเปลี่ยนแปลงจากตาราง flood_incidents
    const channel = supabase
      .channel('incidents_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'flood_incidents' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setIncidents((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setIncidents((prev) =>
              prev.map((item) => (item.id === payload.new.id ? payload.new : item))
            );
          } else if (payload.eventType === 'DELETE') {
            setIncidents((prev) => prev.filter((item) => item.id === payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ฟังก์ชั่นอัปเดตสถานะของเคส
  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const { error: updateError } = await supabase
        .from('flood_incidents')
        .update({ status: newStatus })
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error updating status:', err);
      alert('ไม่สามารถอัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setUpdatingId(null);
    }
  };

  // คืนค่า Badge สำหรับสถานะเคส
  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return {
          label: 'ช่วยเหลือสำเร็จ',
          bg: '#f0fdf4',
          text: '#16a34a',
          border: '#86efac',
          icon: <CheckCircle2 size={16} color="#16a34a" />
        };
      case 'in_progress':
        return {
          label: 'กำลังดำเนินการ',
          bg: '#fefce8',
          text: '#ca8a04',
          border: '#fde047',
          icon: <Clock size={16} color="#ca8a04" />
        };
      case 'pending':
      default:
        return {
          label: 'รอดำเนินการ',
          bg: '#fef2f2',
          text: '#dc2626',
          border: '#fca5a5',
          icon: <AlertCircle size={16} color="#dc2626" />
        };
    }
  };

  // จัดรูปแบบเวลา
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', textDecoration: 'none', fontWeight: 'bold' }}>
          <ArrowLeft size={20} /> หน้าหลัก
        </Link>
        <h1 style={{ fontSize: '1.125rem', margin: 0, color: '#d97706', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={22} /> ศูนย์ควบคุมกู้ภัย
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#16a34a', backgroundColor: '#f0fdf4', padding: '0.35rem 0.65rem', borderRadius: '9999px', border: '1px solid #86efac' }}>
          <Radio size={14} className="animate-pulse" /> Realtime
        </div>
      </header>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#fff', borderRadius: '0.75rem' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#d97706', margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', color: '#64748b' }}>กำลังเชื่อมต่อข้อมูลศูนย์กู้ภัย...</p>
        </div>
      ) : error ? (
        <div style={{ padding: '1.5rem', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '0.75rem', color: '#991b1b', textAlign: 'center' }}>
          <AlertCircle size={32} style={{ margin: '0 auto 0.5rem auto' }} />
          <p style={{ fontWeight: 'bold', margin: 0 }}>{error}</p>
        </div>
      ) : incidents.length === 0 ? (
        <div style={{ backgroundColor: '#fff', padding: '3rem 1rem', textAlign: 'center', borderRadius: '0.75rem', color: '#64748b' }}>
          <CheckCircle2 size={40} color="#16a34a" style={{ margin: '0 auto 0.5rem auto' }} />
          <p style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: 0, color: '#1e293b' }}>ไม่มีรายการขอความช่วยเหลือในขณะนี้</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {incidents.map((incident) => {
            const badge = getStatusBadge(incident.status);
            const isPending = incident.status === 'pending';
            const isInProgress = incident.status === 'in_progress';

            return (
              <div
                key={incident.id}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '1.25rem',
                  borderRadius: '0.75rem',
                  borderLeft: `6px solid ${badge.text}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                {/* Header การ์ด */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#0f172a' }}>
                      {incident.reporter_name}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {formatDate(incident.created_at)}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '9999px',
                      backgroundColor: badge.bg,
                      color: badge.text,
                      border: `1px solid ${badge.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8125rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {badge.icon}
                    {badge.label}
                  </div>
                </div>

                {/* รายละเอียดข้อมูล */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                    <Phone size={16} color="#0284c7" />
                    <strong>เบอร์โทร:</strong> <a href={`tel:${incident.phone}`} style={{ color: '#0284c7', textDecoration: 'none' }}>{incident.phone}</a>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                    <MapPin size={16} color="#e11d48" />
                    <strong>พิกัด:</strong> {incident.latitude}, {incident.longitude}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                    <Droplets size={16} color="#0284c7" />
                    <strong>ระดับน้ำ:</strong> {incident.water_level_cm ? `${incident.water_level_cm} ซม.` : 'ไม่ระบุ'}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                    <Users size={16} color="#d97706" />
                    <strong>จำนวนผู้ประสบภัย:</strong> {incident.people_count || 1} คน
                  </div>
                </div>

                {/* ข้อความเพิ่มเติม */}
                {incident.details && (
                  <div style={{ fontSize: '0.875rem', color: '#475569', backgroundColor: '#fffbe3', padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid #fef08a' }}>
                    <strong>รายละเอียดเพิ่มเติม:</strong> {incident.details}
                  </div>
                )}

                {/* ปุ่มจัดการสถานะ */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                  {isPending && (
                    <button
                      onClick={() => handleUpdateStatus(incident.id, 'in_progress')}
                      disabled={updatingId === incident.id}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#d97706',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      {updatingId === incident.id ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                      รับเคส
                    </button>
                  )}

                  {(isPending || isInProgress) && (
                    <button
                      onClick={() => handleUpdateStatus(incident.id, 'resolved')}
                      disabled={updatingId === incident.id}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      {updatingId === incident.id ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                      ช่วยเหลือสำเร็จ
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
