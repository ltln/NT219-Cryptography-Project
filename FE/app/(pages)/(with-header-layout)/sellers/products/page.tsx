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

import ProductCreateModal from '@/app/components/AdminProductCreateModal';
import SideBar from '@/app/components/AdminSideBar';
import { Button } from '@/app/components/ui/Button';
import { DataTable } from '@/app/components/ui/DataTable';
import categories from '@/app/data/categories.json';
import { product_columns } from '@/app/lib/data-columns';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IBook } from '@/app/models/book';
import { useState, useEffect } from 'react';
import httpClient from '@/app/lib/httpClient';

export default function AdminProductPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: () => httpClient.get<IBook[]>(`/product/my`),
  });

  if (isLoading)
    return (
      <div className="container h-[300px] flex items-center justify-center">
        <div className="lds-ripple"><div></div><div></div></div>
      </div>
    )

  console.log(data);

  return (
      <div className="container grid grid-cols-7 gap-4">
        <div className="col-span-1 bg-white rounded-lg max-h-48">
          <SideBar />
        </div>
        <div className="col-span-6">
          <span className="text-sm font-semibold text-ferra-700">
            Home / Seller / Products
          </span>
          <div className="bg-white w-full px-4 py-3 rounded-lg mb-4 flex gap-2 justify-between">
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="h-8 w-48">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Danh mục</SelectLabel>
                      <SelectItem className="text-gray-500" value="-1" defaultChecked>
                        Không danh mục
                      </SelectItem>
                    {/* {categories.map((d, i) => {
                      return (
                        <SelectItem value={`${i}`} key={i}>
                          {d.name}
                        </SelectItem>
                      );
                    })} */}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <input
                placeholder="Tìm kiếm sách..."
                className="bg-transparent outline-none text-sm border px-4 rounded-md flex-1"
              />
              <ProductCreateModal>
                <Button size="xs" className="right-0">
                  <PlusIcon className="h-5" />
                </Button>
              </ProductCreateModal>
            </div>
          </div>    
          {
            data && data.length > 0 ? (
              <div className="bg-white w-full rounded-lg">
                <DataTable columns={product_columns} data={data} />
              </div>
            ) : (
              <div className="bg-white w-full rounded-lg p-4 text-center">
                <p>Không có sản phẩm đã đăng bán.</p>
              </div>
            )
          }
        </div>
      </div>
  );
}
