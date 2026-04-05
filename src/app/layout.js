import './globals.css';

export const metadata = {
  title: 'NEXATRACK APM01 — Prepaid Metering Gateway',
  description: 'Apartment prepaid electricity monitoring and management dashboard for NEXATRACK APM01 meters.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
