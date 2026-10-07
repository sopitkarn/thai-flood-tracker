'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { ArrowLeft, MapPin, Activity, AlertTriangle, CheckCircle, RefreshCw, Info } from 'lucide-react';

export default function FloodMapPage() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);

  // โหลดข้อมูลสถานีจาก Supabase
  const fetchStations = async () => {

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('flood_stations')
        .select('*');

      if (fetchError) {
        throw fetchError;
      }

      setStations(data || []);
      // ถ้ามีข้อมูล ให้เลือกสถานีแรกเป็น Default
      if (data && data.length > 0 && !selectedStation) {
        setSelectedStation(data[0]);
      }
    } catch (err) {
      console.error('Error fetching flood stations:', err);
      setError('ไม่สามารถโหลดข้อมูลสถานีวัดระดับน้ำได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // ฟังก์ชันคืนค่าการตกแต่งตามสถานะ (เขียว / เหลือง / แดง)
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'critical':
        return {
          label: 'วิกฤต',
          bg: '#fef2f2',
          text: '#dc2626',
          border: '#fca5a5',
          icon: <AlertTriangle size={16} color="#dc2626" />
        };
      case 'warning':
        return {
          label: 'เฝ้าระวัง',
          bg: '#fefce8',
          text: '#ca8a04',
          border: '#fde047',
          icon: <Activity size={16} color="#ca8a04" />
        };
      case 'normal':
      default:
        return {
          label: 'ปกติ',
          bg: '#f0fdf4',
          text: '#16a34a',
          border: '#86efac',
          icon: <CheckCircle size={16} color="#16a34a" />
        };
    }
  };

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header & Navigation */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', textDecoration: 'none', fontWeight: 'bold' }}>
          <ArrowLeft size={20} /> หน้าหลัก
        </Link>
        <h1 style={{ fontSize: '1.25rem', margin: 0, color: '#0f172a' }}>แผนที่เฝ้าระวังระดับน้ำ</h1>
        <button 
          onClick={fetchStations} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 0.75rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', backgroundColor: '#fff', cursor: 'pointer' }}
        >
          <RefreshCw size={16} /> รีเฟรช
        </button>
      </header>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#fff', borderRadius: '0.75rem' }}>
          <Activity size={32} style={{ animation: 'spin 1s linear infinite', color: '#0284c7' }} />
          <p style={{ marginTop: '1rem', color: '#64748b' }}>กำลังโหลดข้อมูลระดับน้ำล่าสุด...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div style={{ padding: '1.5rem', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '0.75rem', color: '#991b1b', textAlign: 'center', marginBottom: '1.5rem' }}>
          <AlertTriangle size={32} style={{ margin: '0 auto 0.5rem auto' }} />
          <p style={{ margin: 0, fontWeight: 'bold' }}>เกิดข้อผิดพลาด</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{error}</p>
          <button onClick={fetchStations} style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
            ลองใหม่อีกครั้ง
          </button>
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          
          {/* ส่วนแสดงแผนที่ OpenStreetMap (iframe) */}
          <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1rem', color: '#334155', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="#0284c7" /> แผนที่ภาพรวมสถานี
            </h2>
            <div style={{ width: '100%', height: '280px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <iframe
                title="OpenStreetMap"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  selectedStation?.longitude ? selectedStation.longitude - 0.05 : 100.4
                }%2C${
                  selectedStation?.latitude ? selectedStation.latitude - 0.05 : 13.7
                }%2C${
                  selectedStation?.longitude ? selectedStation.longitude + 0.05 : 100.6
                }%2C${
                  selectedStation?.latitude ? selectedStation.latitude + 0.05 : 13.9
                }&layer=mapnik&marker=${selectedStation?.latitude || 13.756}%2C${selectedStation?.longitude || 100.501}`}
              ></iframe>
            </div>
            {selectedStation && (
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', textAlign: 'right' }}>
                📍 แสดงพิกัด: {selectedStation.name || 'ไม่ระบุชื่อ'}
              </p>
            )}
          </div>

          {/* รายละเอียดสถานีที่เลือก (Detail Modal Card) */}
          {selectedStation && (
            <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '0.75rem', borderLeft: `6px solid ${getStatusBadge(selectedStation.status).text}`, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>สถานีที่เลือก</span>
                  <h3 style={{ margin: '0.25rem 0', fontSize: '1.25rem', color: '#0f172a' }}>{selectedStation.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>📍 {selectedStation.location || 'ไม่ระบุตำแหน่ง'}</p>
                </div>
                <div style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  backgroundColor: getStatusBadge(selectedStation.status).bg,
                  color: getStatusBadge(selectedStation.status).text,
                  border: `1px solid ${getStatusBadge(selectedStation.status).border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  {getStatusBadge(selectedStation.status).icon}
                  {getStatusBadge(selectedStation.status).label}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>ระดับน้ำปัจจุบัน</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: getStatusBadge(selectedStation.status).text }}>
                    {selectedStation.current_water_level ?? '-'} <span style={{ fontSize: '0.875rem' }}>ม.</span>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>เกณฑ์เตือนภัย</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#334155' }}>
                    {selectedStation.warning_threshold ?? '-'} <span style={{ fontSize: '0.875rem' }}>ม.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* รายการสถานีทั้งหมด (List View) */}
          <div>
            <h2 style={{ fontSize: '1.125rem', color: '#0f172a', marginBottom: '0.75rem' }}>
              รายการสถานีทั้งหมด ({stations.length})
            </h2>

            {stations.length === 0 ? (
              <div style={{ backgroundColor: '#fff', padding: '2rem', textAlign: 'center', borderRadius: '0.75rem', color: '#64748b' }}>
                <Info size={32} style={{ marginBottom: '0.5rem' }} />
                <p>ยังไม่มีข้อมูลสถานีในระบบ</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {stations.map((station) => {
                  const badge = getStatusBadge(station.status);
                  const isSelected = selectedStation?.id === station.id;

                  return (
                    <div
                      key={station.id || Math.random()}
                      onClick={() => setSelectedStation(station)}
                      style={{
                        padding: '1rem',
                        backgroundColor: isSelected ? '#f0f9ff' : '#ffffff',
                        border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: badge.text }}></div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>{station.name}</h4>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8125rem', color: '#64748b' }}>
                            ระดับน้ำ: <strong>{station.current_water_level ?? '-'} ม.</strong> / เกณฑ์: {station.warning_threshold ?? '-'} ม.
                          </p>
                        </div>
                      </div>

                      <div style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.375rem',
                        backgroundColor: badge.bg,
                        color: badge.text,
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {badge.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}
    </main>
  );
}
