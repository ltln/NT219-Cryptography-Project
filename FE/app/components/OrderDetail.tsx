import { Checkbox } from '@/app/components/ui/Checkbox';
import { Input } from '@/app/components/ui/Input';
import { StoreContext } from '@/app/context';
import { TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { CartData } from '../provider/index';

export default function OrderDetail({
  selected,
  setSelected,
}: {
  selected: CartData[];
  setSelected: React.Dispatch<React.SetStateAction<CartData[]>>;
}) {
  const { cartData, setCartData } = useContext(StoreContext);

  function handleDelete(data: CartData) {
    setCartData(cartData.filter((cart) => cart.book.productId !== data.book.productId));
    setSelected(selected.filter((cart) => cart.book.productId !== data.book.productId));
  }

  return (
    <div className="col-span-full lg:col-span-6 rounded-xl">
      <div className="flex bg-white px-4 py-4 rounded-xl mb-4">
        <div className="flex gap-4 w-[55%]">
          <Checkbox
            onCheckedChange={(v) => setSelected(v ? cartData : [])}
            checked={selected.length > 0 && selected.length === cartData.length}
            id="check-all"
            className="h-5 w-5"
          />
          <span className="text-sm">Chọn tất cả ({cartData.length})</span>
        </div>
        <div className="flex flex-1 items-center justify-around max-xl:hidden">
          <div className="flex justify-center">
            <span className="text-sm whitespace-nowrap">Số lượng</span>
          </div>
          <div className="flex justify-center">
            <span className="text-sm whitespace-nowrap">Thành tiền</span>
          </div>
          <div></div>
        </div>
      </div>

      {cartData.length > 0 ? (
        <div className="bg-white px-4 py-4 rounded-xl">
          {cartData.map((data, i) => {
            return (
              <div key={i}>
                <div className="flex max-xl:flex-col items-start xl:items-center flex-1 xl:gap-4">
                  <div className="flex items-center xl:w-[55%] gap-3">
                    <Checkbox
                      id="check-all"
                      className="h-5 w-5"
                      onCheckedChange={(v) =>
                        setSelected(
                          v
                            ? [...selected, data]
                            : selected.filter(
                                (cart) => data.book.productId !== cart.book.productId,
                              ),
                        )
                      }
                      checked={
                        !!selected.find(
                          (cart) => cart.book.productId === data.book.productId,
                        )
                      }
                    />

                    <Link href={'/books/' + data.book.productId}>
                      <Image
                        height={120}
                        width={120}
                        alt=""
                        src={data.book.coverImage || data.book.imageUrl}
                        loading="lazy"
                        className="w-24 h-24 object-cover"
                      />
                    </Link>

                    <div className="h-full flex-1">
                      <h3 className="font-semibold">
                        <Link
                          href={'/books/' + data.book.productId}
                          className="line-clamp-2"
                        >
                          {data.book.name}
                        </Link>
                      </h3>

                      <div className="flex gap-2 items-center mt-4">
                        {data.book.discount ? (
                          <>
                            <span className="font-semibold">
                              {(
                                data.book.price - data.book.discount
                              ).toLocaleString('vi-VN')}{' '}
                              đ
                            </span>
                            <span className="text-xs text-gray-500 line-through">
                              {data.book.price.toLocaleString('vi-VN')} đ
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold">
                            {(data.book.price || 100000).toLocaleString('vi-VN')} đ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex xl:flex-1 items-center justify-between lg:justify-around gap-4 max-xl:pl-36">
                    <div className="">
                      <Input
                        type="number"
                        className="w-16 m-auto"
                        value={data.count}
                        min={0}
                        max={data.book.stock || 100}
                        onChange={(e) => {
                          if (Number(e.target.value) < 1) {
                            handleDelete(data);
                          } else {
                            setCartData(
                              cartData.map((c) =>
                                c.book.productId === data.book.productId
                                  ? { ...c, count: Number(e.target.value) }
                                  : c,
                              ),
                            );
                            setSelected(
                              selected.map((c) =>
                                c.book.productId === data.book.productId
                                  ? { ...c, count: Number(e.target.value) }
                                  : c,
                              ),
                            );
                          }
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-center">
                      <span className="text-lg text-ferra-700 font-semibold whitespace-nowrap">
                        {(
                         data.book.price ?  (data.book.price - data.book.discount) *
                          data.count : 100000 * data.count
                        ).toLocaleString('vi-VN')}{' '}
                        đ
                      </span>
                    </div>

                    <div onClick={() => handleDelete(data)} className="">
                      <TrashIcon
                        height={24}
                        className="text-gray-500 hover:text-red-700 duration-300 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                {i < cartData.length - 1 ? <hr className="mt-4 mb-4" /> : ''}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-lg text-gray-500 text-center mt-6">
          Giỏ hàng của bạn đang trống
        </p>
      )}
    </div>
  );
}
