/* eslint-disable react/display-name */
import Image from 'next/image';
import { Badge } from './ui/Badge';
import Link from 'next/link';
import Stars from './Stars';
import { Skeleton } from './ui/Skeleton';
import { IBook } from '../models/book';

function BookCard({ book }: { book: IBook }) {
  // Check if all specified properties of book are defined before rendering
  if (!book) {
    return null; // Or return a placeholder or loading state
  }

  return (
    <div className="bg-white transition hover:shadow-lg rounded-[0.625rem] overflow-hidden p-4">
      <Link href={`/books/${book.productId}`} className="block aspect-w-1 aspect-h-1">
        <Image
          alt=""
          src={book.coverImage || book.imageUrl} // Use the imageUrl from the book object
          width={200}
          height={200}
          className="w-full object-contain"
        />
      </Link>

      <div className="mt-3">
        <h3 className="font-semibold leading-5 transition hover:text-primary-700">
          <Link href={`/books/${book.productId}`} className="line-clamp-2">
            {book.name}
          </Link>
        </h3>

        <div className="flex items-center mt-2">
          <span className="text-primary-700 font-bold text-lg">
            {book?.price
              ? (book.price - book.discount).toLocaleString('vi-VN')
              : '75.000'}
            đ
          </span>
          <Badge size="sm" className="ml-2">
            -{book.price ? Math.ceil((book.discount / book.price) * 100) : 10}%
          </Badge>
        </div>

        <span className="text-tower-gray-300 line-through font-semibold">
          {(book?.price || 100000).toLocaleString('vi-VN')}đ
        </span>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-700">Đã bán 245</span>

          <Stars value={3.5} className="text-sm" />
        </div>
      </div>
    </div>
  );
}

// Set the displayName property of the function
BookCard.displayName = 'BookCard';

BookCard.Skeleton = ()=>{
  return (
    <div className="p-4">
      <Skeleton className="w-full aspect-w-1 aspect-h-1" />
      <div className="mt-3">
        <div className="space-y-1">
          <Skeleton className="h-4 rounded-full" />
          <Skeleton className="h-4 rounded-full w-8/12" />
        </div>

        <Skeleton className="h-5 rounded-full w-7/12 mt-2" />

        <div className="flex items-center justify-between mt-3">
          <Skeleton className="h-3 rounded-full w-16" />
          <Skeleton className="h-3 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
};

export default BookCard;
