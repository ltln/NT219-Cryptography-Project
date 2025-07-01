import { cn } from '@/app/lib/utils';
import StoreProvider from '@/app/provider/index';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import fonts from './configs/fonts';
import './globals.css';
import QueryProvider from './provider/QueryProvider';

export const metadata: Metadata = {
  title: 'BookStoreOnline',
  description: 'An online bookstore',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-gray-100 antialiased',
          fonts.fontSans.className,
        )}
      >
        <StoreProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
