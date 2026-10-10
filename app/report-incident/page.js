'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import { ArrowLeft, MapPin, Send, AlertTriangle, CheckCircle2, Loader2, Navigation } from 'lucide-react';

export default function ReportIncidentPage() {
  const [formData, setFormData] = useState({
    reporter_name: '',
    phone: '',
    latitude: '',
    longitude: '',
    water_level_cm: '',
    people_count: '',
    details: ''
  });

  const [loading, setLoading] = useState(false);
  const [gettingGps, setGettingGps] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('เบราว์เซอร์ของคุณไม่รองรับการดึงตำแหน่งพิกัด GPS');
      return;
    }

    setGettingGps(true);
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
        setGettingGps(false);
      },
      (error) => {
        console.error('Error getting geolocation:', error);
        setErrorMessage('ไม่สามารถดึงตำแหน่งพิกัดได้ กรุณาอนุญาตการเข้าถึงตำแหน่ง หรือระบุด้วยตนเอง');
        setGettingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.reporter_name.trim()) {
      setErrorMessage('กรุณาระบุชื่อผู้แจ้ง');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('กรุณาระบุเบอร์ติดต่อ');
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      setErrorMessage('กรุณาระบุพิกัดละติจูดและลองจิจูด');
      return;
    }

    setLoading(true);

    try {
      // แปลงค่าข้อมูลอย่างปลอดภัยก่อนส่ง
      const payload = {
        reporter_name: String(formData.reporter_name).trim(),
        phone: String(formData.phone).trim(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        water_level_cm: formData.water_level_cm ? parseInt(formData.water_level_cm, 10) : null,
        people_count: formData.people_count ? parseInt(formData.people_count, 10) : 1,
        details: formData.details ? String(formData.details).trim() : null,
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('flood_incidents')
        .insert([payload])
        .select();

      if (error) {
        throw error;
      }

      setSuccessMessage('ส่งข้อมูลขอความช่วยเหลือเรียบร้อยแล้ว เจ้าหน้าที่จะเร่งประสานงานโดยด่วน');
      setFormData({
        reporter_name: '',
        phone: '',
        latitude: '',
        longitude: '',
        water_level_cm: '',
        people_count: '',
        details: ''
      });
    } catch (err) {
      console.error('Error submitting incident report:', err);
      // แสดงข้อความ Error ที่ส่งกลับมาจาก Supabase โดยตรง
      const detailError = err?.message || err?.details || 'ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้';
      setErrorMessage(`เกิดข้อผิดพลาด: ${detailError}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '640px', margin: '0 auto', padding: '1rem', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', textDecoration: 'none', fontWeight: 'bold' }}>
          <ArrowLeft size={20} /> หน้าหลัก
        </Link>
        <h1 style={{ fontSize: '1.125rem', margin: 0, color: '#e11d48', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} /> แจ้งขอความช่วยเหลือ
        </h1>
      </header>

      <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        {successMessage && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.25rem' }}>
            <CheckCircle2 size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>ส่งข้อมูลสำเร็จ!</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>{successMessage}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.25rem' }}>
            <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>พบข้อผิดพลาด</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', wordBreak: 'break-word' }}>{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={labelStyle}>ชื่อ-นามสกุล ผู้แจ้ง <span style={{ color: '#e11d48' }}>*</span></label>
            <input
              type="text"
              name="reporter_name"
              placeholder="เช่น นายสมชาย ใจดี"
              value={formData.reporter_name}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>เบอร์โทรศัพท์ติดต่อ <span style={{ color: '#e11d48' }}>*</span></label>
            <input
              type="tel"
              name="phone"
              placeholder="เช่น 0812345678"
              value={formData.phone}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label style={{ ...labelStyle, marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={18} color="#0284c7" /> พิกัดตำแหน่งระบุเหตุ <span style={{ color: '#e11d48' }}>*</span>
              </label>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gettingGps}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.4rem 0.75rem',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.8125rem',
                  fontWeight: 'bold',
                  cursor: gettingGps ? 'not-allowed' : 'pointer'
                }}
              >
                {gettingGps ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Navigation size={14} />}
                {gettingGps ? 'กำลังดึงตำแหน่ง...' : 'ดึงตำแหน่งปัจจุบัน (GPS)'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>ละติจูด (Latitude)</span>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  placeholder="เช่น 13.7563"
                  value={formData.latitude}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>ลองจิจูด (Longitude)</span>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  placeholder="เช่น 100.5018"
                  value={formData.longitude}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>ระดับน้ำโดยประมาณ (ซม.)</label>
              <input
                type="number"
                name="water_level_cm"
                placeholder="เช่น 50"
                value={formData.water_level_cm}
                onChange={handleChange}
                style={inputStyle}
                min="0"
              />
            </div>
            <div>
              <label style={labelStyle}>จำนวนผู้ประสบภัย (คน)</label>
              <input
                type="number"
                name="people_count"
                placeholder="เช่น 3"
                value={formData.people_count}
                onChange={handleChange}
                style={inputStyle}
                min="1"
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>รายละเอียดเพิ่มเติม</label>
            <textarea
              name="details"
              rows={4}
              placeholder="ระบุเพิ่มเติม เช่น มีผู้ป่วยติดเตียง / ผู้สูงอายุ / ต้องการอาหารและน้ำดื่มด่วน..."
              value={formData.details}
              onChange={handleChange}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.875rem',
              backgroundColor: loading ? '#94a3b8' : '#e11d48',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={20} />}
            {loading ? 'กำลังส่งข้อมูล...' : 'ส่งขอความช่วยเหลือ'}
          </button>
        </form>
      </div>
    </main>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 'bold',
  color: '#334155',
  marginBottom: '0.375rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.625rem',
  fontSize: '0.875rem',
  border: '1px solid #cbd5e1',
  borderRadius: '0.375rem',
  outline: 'none',
  boxSizing: 'border-box'
};
