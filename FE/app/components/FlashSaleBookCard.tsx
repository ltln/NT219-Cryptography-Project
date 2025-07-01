import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Badge } from './ui/Badge';
import Link from 'next/link';
import { IBook } from '../models/book';

export default function FlashSaleBookCard({ book }: { book: IBook }) {
  const [soldCount, setSoldCount] = useState(10); // Initial sold count

  useEffect(() => {
    // Update the sold count periodically (e.g., every 5 seconds)
    const intervalId = setInterval(() => {
      // Simulate a random increase in sold count
      setSoldCount((prevSoldCount) => prevSoldCount + Math.floor(Math.random() * 5));
    }, 1000); // Update every 5 seconds

    return () => clearInterval(intervalId); // Clean up the interval
  }, []);

  // Calculate the progress percentage based on the sold count
  const progressPercentage = (soldCount / 500) * 100;

  return (
    <div className="bg-white transition hover:shadow-lg rounded-[0.625rem] overflow-hidden p-4 relative transform hover:scale-105">
      <span className="absolute top-2 right-2 bg-red-500 text-white py-1 px-2 rounded-full text-xs font-bold z-10">
        Flash Sale
      </span>
      <div className="w-full">
        <Link href={'/books/' + book.productId} className="block aspect-w-1 aspect-h-1">
          <Image
            alt=""
            src={book.coverImage || book.imageUrl}
            width={200}
            height={200}
            className="w-full object-contain"
          />
        </Link>
        
        <div className="mt-3">
          <h3 className="font-semibold leading-5 text-lg text-center">
            <Link href={'/books/' + book.productId} className="line-clamp-2">
              {book.name}
            </Link>
          </h3>

          <div className="flex justify-center items-center mt-2">
            <span className="text-primary-700 font-bold text-lg">
              {((book.price || 100000) - (book.discount ?? 1000)).toLocaleString('vi-VN')}đ
            </span>
            <Badge size="sm" className="ml-2">
              -{book.price ? Math.ceil((book.discount / book.price) * 100) : 0}%
            </Badge>
          </div>

          <span className="text-tower-gray-300 line-through font-semibold block mt-1 text-center">
            {(book.price || 100000).toLocaleString('vi-VN')}đ
          </span>

          <div className="h-3 bg-tower-gray-300 mt-3 relative rounded-full">
            <div
              style={{
                width: `${progressPercentage}%`, // Set the width based on the progressPercentage
              }}
              className="h-3 rounded-full bg-casal-700 transition-all duration-1000"
            ></div>
            <span className="absolute text-[0.625rem] font-semibold text-white top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
              {soldCount} đã bán
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
