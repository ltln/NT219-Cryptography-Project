'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IBook } from '../models/book';
import { StoreContext } from '../context';

export interface CartData {
  book: IBook;
  count: number;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartData, setCartData_] = useState<CartData[]>([]);
  useEffect(() => {
    if (localStorage) {
      setCartData(
        localStorage.getItem('cart')
          ? JSON.parse(localStorage.getItem('cart') as string)
          : [],
      );
    }
  }, []);

  const setCartData: Dispatch<SetStateAction<CartData[]>> = (data) => {
    localStorage.setItem('cart', JSON.stringify(data));
    setCartData_(data);
  };

  return (
    <StoreContext.Provider value={{ cartData, setCartData }}>
      {children}
    </StoreContext.Provider>
  );
}
