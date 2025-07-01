'use client';

import { Metadata } from 'next';
import Banner from '../../../pages-sections/home/Banner';
import BooksByCategory from '../../../pages-sections/home/BooksByCategory';
import CategoriesList from '../../../pages-sections/home/CategoriesList';
import Discover from '../../../pages-sections/home/Discover';
import FlashSale from '../../../pages-sections/home/FlashSale';
import httpClient from '@/app/lib/httpClient';
import { useQuery } from '@tanstack/react-query';
import { IBook } from '@/app/models/book';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

// export const metadata: Metadata = {
//   title: 'Trang chủ BookStore',
//   description: 'Nhà sách trực tuyến BookStore.',
// };

export default function HomePage() {
  const { data, error } = useQuery({
    queryKey: ['books'],
    queryFn: () => httpClient.get<IBook[]>('/product'),
  });

  useEffect(() => {
    document.title = 'Trang chủ BookStore';

    if (error) {
      toast.error('Không thể tải dữ liệu sách. Vui lòng thử lại sau.');
    }
  }, []);

  return (
    <main className="space-y-12">
      <Banner />
      <FlashSale books={data ? data : null} />
      <CategoriesList />
      <Discover books={data ? data : null} />
      <BooksByCategory books={data ? data : null} />
      <BooksByCategory books={data ? data : null} />
    </main>
  );
}
