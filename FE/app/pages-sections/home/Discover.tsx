'use client';
import { useState } from 'react';
import BookCard from '@/app/components/BookCard';
import { Button } from '@/app/components/ui/Button';
import { FireIcon } from '@heroicons/react/24/outline';
import { IBook } from '@/app/models/book';

export default function Discover({ books }: { books: IBook[] | null }) {
  const [show, setShow] = useState(20);

  return (
    <section className="bg-white p-4 pb-6 rounded-[0.625rem]">
      <h2 className="flex items-center text-primary-700">
        <FireIcon className="h-7 mr-3" />
        <span className="text-lg font-semibold">Khám phá</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
        {books
          ? books
              .slice(0, show)
              .map((book) => <BookCard key={book.productId} book={book} />)
          : Array.from({ length: 10 }).map((_, i) => (
              <BookCard.Skeleton key={i} />
            ))}
      </div>

      {books && show < books.length && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={() => setShow(show + 20)}>
            Xem thêm
          </Button>
        </div>
      )}
    </section>
  );
}
