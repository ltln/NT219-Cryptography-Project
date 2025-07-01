import React from 'react';
import { Checkbox } from '@/app/components/ui/Checkbox';
import { Input } from '@/app/components/ui/Input';
import { TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { StoreContext } from '@/app/context';
import { useContext } from 'react';

export default function OrderDetail() {
  const { cartData } = useContext(StoreContext);

  return (
    <div className="col-span-full lg:col-span-6 rounded-xl">
      <div className="flex bg-white px-4 py-3 rounded-xl mb-4 gap-2 items-center">
        <Checkbox id="check-all" className="h-5 w-5 border-gray-500 border-opacity-80 checked:bg-ferra-700 rounded-sm" />
        <span className="text-sm">Chọn tất cả ({cartData.length})</span>
      </div>
      <div className="bg-white px-4 py-4 rounded-xl">
        {cartData.map((data: any, i: number) => (
          <div key={i} className="flex items-center gap-4 mb-4">
            <Checkbox id={`check-${data._id}`} checked={data.isChecked} className="h-5 w-5 border-gray-500 border-opacity-80 checked:bg-ferra-700 rounded-sm" />
            <div className="flex items-center gap-4 flex-grow">
            {<Image
              height={120}
              width={120}
              alt=""
              src={data.coverImage !== undefined && data.coverImage !== null ? data.coverImage : data.imageUrl}
              loading="lazy"
            />}
              <div className="flex flex-col">
                <p className="text-sm">{data.title}</p>
                <div className="flex items-center gap-2">
                  {data.discount ? (
                    <>
                      <span className="font-semibold">{((data.price * (100 - data.discountPercent)) / 100).toLocaleString('vi-VN')} đ</span>
                      <span className="text-xs text-gray-500 line-through">1đ</span>
                    </>
                  ) : (
                    <span className="font-semibold">2đ</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input type="number" className="w-16 text-center" value={data.quantity} />
              <span className="text-lg font-semibold">{((data.price * (100 - data.discountPercent) * data.quantity) / 100).toLocaleString('vi-VN')} đ</span>
              <TrashIcon className="h-6 w-6 text-gray-500 hover:text-red-700 cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
