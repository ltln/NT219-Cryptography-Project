'use client';

import BookCard from '@/app/components/BookCard';
import { Button } from '@/app/components/ui/Button';
import { IBook } from '@/app/models/book';
import Sidebar from '@/app/pages-sections/search/Sidebar';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(20);

  const query = searchParams.get('q');

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () =>
      axios
        .get<{ books: IBook[] }>('/api/booksearch/' + query)
        .then((res) => res.data),
    enabled: !!query,
  });

  const books = data?.books;

  return (
    <div className="grid xl:grid-cols-12 gap-4">
      <div className="xl:col-span-3">
        <Sidebar />
      </div>

      <div className="xl:col-span-9 bg-white rounded-[0.625rem] p-4 pb-6">
        <h4 className="font-semibold mb-3">
          Tìm được{' '}
          <span className="text-primary-700">{books?.length || 0}</span> kết quả
          dựa vào từ khoá: <span className="text-primary-700">{query}</span>
        </h4>

        {isLoading ? (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <BookCard.Skeleton key={index} />
            ))}
          </div>
        ) : books && books.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {books.slice(0, show).map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-center mt-6">Không tìm thấy sách</p>
        )}

        {books && show < books.length && (
          <div className="flex justify-center mt-8">
            <Button variant="outline" onClick={() => setShow(show + 20)}>
              Xem thêm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
