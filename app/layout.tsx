import Footer from '@/components/Footer';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Questa',
  description: 'Quiz app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-screen w-screen overflow-hidden flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
