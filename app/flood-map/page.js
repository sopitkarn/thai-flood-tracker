'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { MapPin, ArrowLeft, RefreshCw, AlertTriangle, CheckCircle, ShieldAlert, Navigation } from 'lucide-react';

export default function FloodMapPage() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // ดึงข้อมูลสถานีวัดระดับน้ำจาก Supabase
  const fetchStations = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('flood_stations')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setStations(data || []);
      if (data && data.length > 0 && !selectedStation) {
        setSelectedStation(data[0]);
      }
    } catch (err) {
      console.error('Error fetching flood stations:', err);
      setError(err.message || 'ไม่สามารถดึงข้อมูลสถานีวัดระดับน้ำได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // กรองข้อมูลสถานีตามสถานะ
  const filteredStations = stations.filter((station) => {
    if (filterStatus === 'all') return true;
    return station.status === filterStatus;
  });

  // ฟังก์ชันคืนค่าการตกแต่งตามสถานะ (เขียว / เหลือง / แดง)
  const getStatusBadge = (status) => {
    switch (status) {
      case 'critical':
        return {
          label: 'วิกฤต',
          bg: '#fee2e2',
          text: '#dc2626',
          border: '#fca5a5',
          icon: <ShieldAlert size={16} color="#dc2626" />,
        };
      case 'warning':
        return {
          label: 'เฝ้าระวัง',
          bg: '#fef3c7',
          text: '#d97706',
          border: '#fcd34d',
          icon: <AlertTriangle size={16} color="#d97706" />,
        };
      case 'normal':
      default:
        return {
          label: 'ปกติ',
          bg: '#dcfce7',
          text: '#16a34a',
          border: '#86efac',
          icon: <CheckCircle size={16} color="#16a34a" />,
        };
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <Link href="/" style={styles.backBtn}>
          <ArrowLeft size={18} /> กลับหน้าหลัก
        </Link>
        <h1 style={styles.title}>
          <MapPin color="#2563eb" size={28} /> แผนที่ติดตามระดับน้ำ
        </h1>
        <p style={styles.subtitle}>
          เฝ้าระวังระดับน้ำและพื้นที่เสี่ยงภัยแบบเรียลไทม์
        </p>
      </header>

      {/* Filter & Refresh Controls */}
      <div style={styles.controlBar}>
        <div style={styles.filterGroup}>
          <button
            onClick={() => setFilterStatus('all')}
            style={filterStatus === 'all' ? styles.filterBtnActive : styles.filterBtn}
          >
            ทั้งหมด ({stations.length})
          </button>
          <button
            onClick={() => setFilterStatus('normal')}
            style={filterStatus === 'normal' ? styles.filterBtnActive : styles.filterBtn}
          >
            ปกติ
          </button>
          <button
            onClick={() => setFilterStatus('warning')}
            style={filterStatus === 'warning' ? styles.filterBtnActive : styles.filterBtn}
          >
            เฝ้าระวัง
          </button>
          <button
            onClick={() => setFilterStatus('critical')}
            style={filterStatus === 'critical' ? styles.filterBtnActive : styles.filterBtn}
          >
            วิกฤต
          </button>
        </div>

        <button onClick={fetchStations} style={styles.refreshBtn} disabled={loading}>
          <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          รีเฟรชข้อมูล
        </button>
      </div>

      {/* Main Layout (Map & Station Cards) */}
      {loading ? (
        <div style={styles.stateCard}>
          <RefreshCw size={32} style={{ animation: spinAnimation }} />
          <p style={{ marginTop: '0.75rem', color: '#64748b' }}>กำลังโหลดข้อมูลสถานีวัดน้ำ...</p>
        </div>
      ) : error ? (
        <div style={{ ...styles.stateCard, backgroundColor: '#fef2f2', borderColor: '#fca5a5' }}>
          <AlertTriangle size={36} color="#dc2626" />
          <h3 style={{ color: '#dc2626', margin: '0.5rem 0 0.25rem' }}>เกิดข้อผิดพลาดในการโหลดข้อมูล</h3>
          <p style={{ color: '#7f1d1d', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchStations} style={styles.retryBtn}>
            ลองใหม่อีกครั้ง
          </button>
        </div>
      ) : (
        <div style={styles.contentGrid}>
          {/* แผนที่ OpenStreetMap iframe Embed */}
          <div style={styles.mapContainer}>
            <div style={styles.mapHeader}>
              <Navigation size={18} color="#2563eb" />
              <span style={{ fontWeight: '600', color: '#1e293b' }}>
                {selectedStation ? `พิกัดสถานี: ${selectedStation.name}` : 'ตำแหน่งบนแผนที่'}
              </span>
            </div>
            {selectedStation && selectedStation.latitude && selectedStation.longitude ? (
              <iframe
                title="OpenStreetMap"
                width="100%"
                height="380"
                style={{ border: 0, borderRadius: '0 0 12px 12px' }}
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedStation.longitude - 0.05}%2C${selectedStation.latitude - 0.05}%2C${selectedStation.longitude + 0.05}%2C${selectedStation.latitude + 0.05}&layer=mapnik&marker=${selectedStation.latitude}%2C${selectedStation.longitude}`}
              />
            ) : (
              <div style={styles.mapPlaceholder}>
                <MapPin size={40} color="#94a3b8" />
                <p style={{ color: '#64748b', marginTop: '0.5rem' }}>กรุณาเลือกสถานีด้านล่างเพื่อแสดงพิกัดบนแผนที่</p>
              </div>
            )}
          </div>

          {/* รายการการ์ดสถานีวัดระดับน้ำ */}
          <div style={styles.stationListSection}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#0f172a' }}>
              รายการสถานีวัดระดับน้ำ ({filteredStations.length})
            </h2>

            {filteredStations.length === 0 ? (
              <div style={styles.emptyCard}>ไม่พบข้อมูลสถานีในหมวดหมู่นี้</div>
            ) : (
              <div style={styles.cardsGrid}>
                {filteredStations.map((station) => {
                  const isSelected = selectedStation?.id === station.id;
                  const badge = getStatusBadge(station.status);

                  return (
                    <div
                      key={station.id || station.name}
                      onClick={() => setSelectedStation(station)}
                      style={{
                        ...styles.stationCard,
                        borderColor: isSelected ? '#2563eb' : '#e2e8f0',
                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                        boxShadow: isSelected ? '0 0 0 2px #93c5fd' : '0 2px 4px rgba(0,0,0,0.05)',
                      }}
                    >
                      <div style={styles.cardHeader}>
                        <h3 style={styles.stationName}>{station.name}</h3>
                        <span
                          style={{
                            ...styles.badge,
                            backgroundColor: badge.bg,
                            color: badge.text,
                            borderColor: badge.border,
                          }}
                        >
                          {badge.icon} {badge.label}
                        </span>
                      </div>

                      <div style={styles.levelDetail}>
                        <div style={styles.levelBox}>
                          <span style={styles.levelLabel}>ระดับน้ำปัจจุบัน</span>
                          <span style={{ ...styles.levelValue, color: badge.text }}>
                            {station.current_level ?? '-'} <small style={{ fontSize: '0.8rem' }}>ม.</small>
                          </span>
                        </div>

                        <div style={styles.levelBox}>
                          <span style={styles.levelLabel}>เกณฑ์เตือนภัย</span>
                          <span style={styles.thresholdValue}>
                            {station.warning_threshold ?? '-'} <small style={{ fontSize: '0.8rem' }}>ม.</small>
                          </span>
                        </div>
                      </div>

                      {station.location_name && (
                        <p style={styles.locationText}>
                          <MapPin size={12} style={{ marginRight: '4px' }} />
                          {station.location_name}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const spinAnimation = 'spin 1s linear infinite';

// Inline CSS Styles (รองรับ Responsive มือถือ)
const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '1.5rem 1rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#1e293b',
  },
  header: {
    marginBottom: '1.5rem',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginBottom: '0.75rem',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.75rem',
    margin: '0 0 0.25rem 0',
    color: '#0f172a',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '0.95rem',
    margin: 0,
  },
  controlBar: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
    backgroundColor: '#ffffff',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  },
  filterGroup: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    color: '#475569',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  filterBtnActive: {
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    border: '1px solid #2563eb',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  refreshBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.8rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#334155',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  stateCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  retryBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  contentGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  mapContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
  },
  mapHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },
  mapPlaceholder: {
    height: '280px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  stationListSection: {
    marginTop: '0.5rem',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
  },
  stationCard: {
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  stationName: {
    fontSize: '1rem',
    fontWeight: '600',
    margin: 0,
    color: '#0f172a',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.2rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    border: '1px solid transparent',
  },
  levelDetail: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.5rem',
    backgroundColor: '#ffffff',
    padding: '0.5rem',
    borderRadius: '6px',
    border: '1px solid #f1f5f9',
  },
  levelBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  levelLabel: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
  levelValue: {
    fontSize: '1.25rem',
    fontWeight: '700',
  },
  thresholdValue: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#475569',
  },
  locationText: {
    fontSize: '0.8rem',
    color: '#64748b',
    margin: '0.5rem 0 0 0',
    display: 'flex',
    alignItems: 'center',
  },
  emptyCard: {
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    color: '#64748b',
    border: '1px dashed #cbd5e1',
  },
};
