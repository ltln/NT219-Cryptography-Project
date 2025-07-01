'use client';
import React, { useEffect, useState } from 'react';
import BookCardsList from '@/app/components/BookCardsList';
import FlashSaleBookCard from '@/app/components/FlashSaleBookCard';
import { IBook } from '@/app/models/book';
import { BoltIcon } from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import httpClient from '@/app/lib/httpClient';

export default function FlashSale({ books }: { books: IBook[] | null }) {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const currentTime = new Date().getTime();
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    const targetEndTime = currentTime + oneDayInMilliseconds;

    const intervalId = setInterval(() => {
      const currentTime = new Date().getTime();
      const remaining = targetEndTime - currentTime;
      setTimeRemaining(Math.max(0, remaining));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = new Date(timeRemaining).toISOString().substr(11, 8);

  return (
    <section className="bg-donkey-brown-400 w-screen relative left-[calc(-50vw+50%)]">
      <div className="container pt-6 pb-10 mx-auto">
        <div className="bg-white h-12 rounded-[0.625rem] overflow-hidden flex items-center">
          <div className="h-full bg-primary-700 pl-8 pr-28 inline-flex items-center font-extrabold italic text-white [clip-path:polygon(0_0,80%_0,100%_100%,0%_100%)] text-lg">
            <span>FLASH</span>
            <BoltIcon className="h-7 text-banana-mania-200 -mr-1" />
            <span>ALE</span>
          </div>
          <div className="ml-10 font-bold text-lg tracking-widest">
            {formattedTime}
          </div>
        </div>
        {books ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
            {books.slice(0, 5).map((book, index) => (
              <FlashSaleBookCard key={index} book={book} />
            ))}
          </div>
        ) : (
          <BookCardsList.Skeleton length={5} />
        )}
      </div>
    </section>
  );
}
