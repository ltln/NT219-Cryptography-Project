import BookCardsList from '@/app/components/BookCardsList';
import httpClient from '@/app/lib/httpClient';
import { IBook } from '@/app/models/book';
import { useQuery } from '@tanstack/react-query';

export default function RelatedBooks() {
  const { data } = useQuery({
    queryKey: ['books'],
    queryFn: () => httpClient.get<IBook[]>(`/product`),
  });

  const books = data;

  return (
    <section className="bg-white rounded-[0.625rem] p-4 pb-6">
      <h3 className="font-semibold text-lg text-primary-700">Sách liên quan</h3>
      {books ? (
        <BookCardsList data={books.slice(0,5)} />
      ) : (
        <BookCardsList.Skeleton />
      )}
    </section>
  );
}
