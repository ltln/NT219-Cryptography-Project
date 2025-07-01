import { createContext } from 'react';
import { CartData } from '../provider/index';

export const StoreContext = createContext<{
  cartData: CartData[];
  setCartData: React.Dispatch<React.SetStateAction<CartData[]>>;
}>({ cartData: [], setCartData: () => {} });
