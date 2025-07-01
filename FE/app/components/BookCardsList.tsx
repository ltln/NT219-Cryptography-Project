/* eslint-disable react/display-name */
import { IBook } from '../models/book';
import BookCard from './BookCard';

function BookCardsList({ data }: { data: IBook[] }) {
  return (
    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
      {data.map((book, index) => (
        <BookCard key={index} book={book} />
      ))}
    </div>
  );
}

BookCardsList.Skeleton = ({ length = 10 }: { length?: number }) => {
  return (
    <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
      {Array.from(Array(length)).map((_, index) => (
        <BookCard.Skeleton key={index} />
      ))}
    </div>
  );
};

export default BookCardsList;
