export const metadata = {
  title: 'Thai Flood Tracker',
  description: 'ระบบติดตามและแจ้งเตือนสถานการณ์น้ำท่วม',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ margin: 0, fontFamily: 'sans-serif', backgroundColor: '#f4f6f8' }}>
        {children}
      </body>
    </html>
  );
}
