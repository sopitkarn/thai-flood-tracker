export const metadata = {
  title: 'Thai Flood Tracker - ระบบติดตามสถานการณ์น้ำท่วม',
  description: 'ติดตามสถานการณ์น้ำท่วมและแจ้งขอความช่วยเหลือ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ margin: 0, backgroundColor: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}
