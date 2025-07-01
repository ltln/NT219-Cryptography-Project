import Footer from '@/app/components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BookStore',
  icons: '/logo.svg'
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
}
