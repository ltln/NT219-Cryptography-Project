'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/Select';
import React from 'react';

import SideBar from '@/app/components/AdminSideBar';
import { Button } from '@/app/components/ui/Button';
import { DataTable } from '@/app/components/ui/DataTable';
import { order_columns } from '@/app/lib/data-columns';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IOrder } from '@/app/models/order';
import { IBook } from '@/app/models/book';
import httpClient from '@/app/lib/httpClient';


export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => httpClient.get<IOrder[]>('/order/sellers'),
  });

  console.log(data);

  if (isLoading)
    return (
      <div className="container h-[300px] flex items-center justify-center">
        <div className="lds-ripple"><div></div><div></div></div>
      </div>
    )

  return (
    data && (
      <div className="container grid grid-cols-7 gap-4">
        <div className="col-span-1 max-lg:col-span-7 bg-white rounded-lg max-h-48">
          <SideBar />
        </div>
        <div className="col-span-6 max-lg:col-span-7">
          <span className="text-sm font-semibold text-ferra-700">
            Home / Admin / Orders
          </span>
          <div className="bg-white w-full rounded-lg">
            <DataTable columns={order_columns} data={data} />
          </div>
        </div>
      </div>
    )
  );
}

