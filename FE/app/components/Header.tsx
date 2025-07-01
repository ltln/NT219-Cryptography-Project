'use client';

import { StoreContext } from '@/app/context/index';
import { cn } from '@/app/lib/utils';
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  DocumentTextIcon,
  IdentificationIcon,
  LockClosedIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import fonts from '../configs/fonts';
import routes from '../configs/routes';
import SearchBar from './SearchBar';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover';
import { useAuth } from '../lib/hooks/useAuth';
import { Package } from 'lucide-react';

export default function Header() {
  const { cartData } = useContext(StoreContext);
  const { user, logout } = useAuth();

  return (
    <header className="lg:h-16 fixed inset-x-0 top-0 z-50 bg-white flex items-center flex-wrap shadow-md shadow-gray-300/10">
      <Link
        href={routes.home}
        className="lg:hidden flex justify-center pt-2 basis-full"
      >
        <Image
          src="/logo.svg"
          alt="logo"
          width={67}
          height={50}
          className="h-8"
        />
        <h1
          className={cn(fonts.logoFont.className, 'text-2xl text-primary-700')}
        >
          Bookstore
        </h1>
      </Link>
      <div className="container flex items-center justify-between">
        <Link href={routes.home} className="max-lg:hidden flex items-center">
          <Image
            src="/logo.svg"
            alt="logo"
            width={67}
            height={50}
            className="h-8"
          />
          <h1
            className={cn(
              fonts.logoFont.className,
              'text-2xl text-primary-700',
            )}
          >
            Bookstore
          </h1>
        </Link>

        <SearchBar />

        <div className="flex items-center space-x-8">
          <Popover>
            <PopoverTrigger className="cursor-pointer flex items-center text-gray-500">
              <div className="inline-flex items-center text-gray-500">
                <UserCircleIcon className="h-6 mr-2" />
                <span className="font-semibold max-lg:hidden">Tài khoản</span>
              </div>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={24}
              className="rounded-lg p-0 w-60"
            >
              {user ? (
                <>
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-500">Xin chào,</p>
                    <p className="font-bold text-ferra-700">
                      {user.fullName ?? ""}
                    </p>
                  </div>
                  <hr />
                  <Link
                    href={routes.profile}
                    className="flex gap-2 px-4 py-3 cursor-pointer hover:bg-ferra-400 text-sm duration-300 text-gray-500 hover:text-white"
                  >
                    <IdentificationIcon className="h-5" />
                    Hồ sơ
                  </Link>
                  <hr />
                  <Link
                    href={routes.purchase}
                    className="flex gap-2 px-4 py-3 cursor-pointer hover:bg-ferra-400 text-sm duration-300 text-gray-500 hover:text-white"
                  >
                    <DocumentTextIcon className="h-5" />
                    Lịch sử mua hàng
                  </Link>
                  <hr />
                  <Link
                    href="/sellers/products"
                    className="flex gap-2 px-4 py-3 cursor-pointer hover:bg-ferra-500 text-sm duration-300 text-gray-500 hover:text-white"
                  >
                    <Package className="h-5" />
                    Người bán
                  </Link>
                  <hr />
                  <div
                    onClick={logout}
                    className="flex gap-2 px-4 py-3 cursor-pointer hover:bg-red-400 text-sm duration-300 text-gray-500 hover:text-white rounded-bl-lg rounded-br-lg"
                  >
                    <ArrowLeftStartOnRectangleIcon className="h-5" />
                    Đăng xuất
                  </div>
                </>
              ) : (
                <>
                  <SignIn>
                    <div className="flex gap-2 px-4 py-3 cursor-pointer hover:bg-ferra-400 text-sm duration-300 text-gray-500 hover:text-white rounded-tl-lg rounded-tr-lg">
                      <ArrowRightEndOnRectangleIcon className="h-5" />
                      Đăng nhập
                    </div>
                  </SignIn>
                  <hr />
                  <SignUp>
                    <div className="flex gap-2 px-4 py-3 cursor-pointer hover:bg-ferra-400 text-sm duration-300 text-gray-500 hover:text-white rounded-bl-lg rounded-br-lg">
                      <UserPlusIcon className="h-5" />
                      Đăng ký
                    </div>
                  </SignUp>
                </>
              )}
            </PopoverContent>
          </Popover>

          <Link
            href={routes.cart}
            className="inline-flex items-center text-gray-500"
          >
            <ShoppingCartIcon className="h-6 mr-2" />
            <span className="font-semibold max-lg:hidden">Giỏ hàng</span>
            <span className="bg-casal-700 text-white font-semibold text-xs leading-4 ml-2 px-1.5 rounded-full">
              {cartData.length}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
