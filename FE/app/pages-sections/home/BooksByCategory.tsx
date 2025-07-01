'use client'

import BookCardsList from '@/app/components/BookCardsList';
import { Button } from '@/app/components/ui/Button';
import { IBook } from '@/app/models/book';
import { ArrowRightIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function BooksByCategory({ books }: { books: IBook[] | null }) {
  return (
    <section className="bg-white p-4 pb-6 rounded-[0.625rem]">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center text-primary-700 relative">
          <ChevronRightIcon className="h-6 mr-3" />
          <span className="text-lg font-semibold">Truyện tranh</span>
          <div className="absolute h-[1.5px] bg-primary-700 rounded-full w-[90%] -bottom-0.5 left-10"></div>
        </h2>

        <Link
          href={''}
          className="flex items-center text-sm font-medium transition hover:text-primary-700"
        >
          <span>Xem tất cả</span>
          <ArrowRightIcon className="h-3 ml-2" />
        </Link>
      </div>

      <div className="mt-4">
        {books ? (
          <BookCardsList data={books.slice(0,10)} />
        ) : (
          <BookCardsList.Skeleton />
        )}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline">Xem thêm</Button>
      </div>
    </section>
  );
}
