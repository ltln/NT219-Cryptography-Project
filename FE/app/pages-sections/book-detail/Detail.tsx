'use client';

import { Button } from '@/app/components/ui/Button';
import { Separator } from '@/app/components/ui/Separator';
import { IBook } from '@/app/models/book';
import { useState } from 'react';

export default function Detail({ book }: { book: IBook }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="bg-white rounded-[0.625rem] p-4">
      <div>
        <h3 className="font-semibold text-lg text-primary-700">
          Chi tiết sản phẩm
        </h3>

        <div className="md:pl-10 sm:pl-6 mt-3">
          <table>
            <tbody>
              <tr>
                <td className="font-medium pr-28 py-1.5">Người bán:</td>
                <td>{book.seller.fullname ?? book.seller.userId}</td>
              </tr>

              <tr>
                <td className="font-medium pr-28 py-1.5">Danh mục:</td>
                <td>{book.category}</td>
              </tr>

              <tr>
                <td className="font-medium pr-28 py-1.5">Tác giả:</td>
                <td>{book.author}</td>
              </tr>

              <tr>
                <td className="font-medium pr-28 py-1.5">Nhà xuất bản:</td>
                <td>{book.publisher}</td>
              </tr>

              <tr>
                <td className="font-medium pr-28 py-1.5">Năm xuất bản:</td>
                <td>{book.publishYear}</td>
              </tr>

              <tr>
                <td className="font-medium pr-28 py-1.5">Ngôn ngữ:</td>
                <td>{book.language}</td>
              </tr>

              <tr>
                <td className="font-medium pr-28 py-1.5">Khối lượng:</td>
                <td>{book.weight && book.weight + 'g'}</td>
              </tr>

              <tr>
                <td className="font-medium pr-28 py-1.5">Kích thước:</td>
                <td>
                  {`${book.dimensionsX} x ${book.dimensionsY} x ${book.dimensionsZ} cm`}
                </td>
              </tr>

              <tr>
                <td className="font-medium pr-28 py-1.5">Số trang:</td>
                <td>{book.pageCount}</td>
              </tr>

              <tr>
                <td className="font-medium pr-28 py-1.5">Hình thức bìa:</td>
                <td>{book.coverType == 'soft' ? 'Bìa mềm' : 'Bìa cứng'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-lg text-primary-700">
          Mô tả sản phẩm
        </h3>

        {book?.description && (
          <div
            className="prose prose-sm max-w-none sm:px-2 md:px-4 mt-3"
            dangerouslySetInnerHTML={{
              __html: book.description
                .replaceAll('\n', '<br/>')
                .slice(0, showMore ? undefined : 500),
            }}
          ></div>
        )}

        {book.description &&
          book.description.replaceAll('\n', '<br/>').length > 500 && (
            <div className="flex justify-center mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? 'Ẩn bớt' : 'Xem thêm'}
              </Button>
            </div>
          )}
      </div>
    </section>
  );
}
