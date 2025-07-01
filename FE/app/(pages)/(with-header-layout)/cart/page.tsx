'use client';

import React from 'react';

import OrderDetail from '@/app/components/OrderDetail';
import Thanhtoan from '@/app/components/Thanhtoan';
import { CartData } from '@/app/provider/index';

export default function CartPage() {
  const [selected, setSelected] = React.useState<CartData[]>([]);

  return (
    <div className="max-lg:p-0 container">
      <span className="text-sm font-semibold text-ferra-700">
        Home / Cart / Checkout
      </span>
      <div className="grid grid-cols-9 gap-4 mt-2">
        <OrderDetail selected={selected} setSelected={setSelected} />
        <Thanhtoan selected={selected} />
      </div>
    </div>
  );
}
