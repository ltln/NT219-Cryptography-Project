'use client';

import SignIn from '@/app/components/SignIn';
import SignUp from '@/app/components/SignUp';
import { Button } from '@/app/components/ui/Button';
import { useAuth } from '@/app/lib/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Bán hàng";
  })

  if (!user) {
    return (
      <div className="container h-[500px] max-w-[1000px] gap-4 flex items-center justify-center max-lg:flex-col max-lg:pt-32">
        <div className="text-right max-lg:text-center">
          <p className="text-2xl font-bold text-ferra-700 mb-4">Chưa đăng nhập 🔒</p>
          <p className="mb-4">Bạn cần đăng nhập để xem được trang này.</p>
          <div className="flex gap-2">
          <Button>
            <Link href="/">
              Trang chủ
            </Link>
          </Button>
          <Button>
            <SignIn>
              <span>Đăng nhập</span>
            </SignIn>
          </Button>
          <Button>
            <SignUp>
              <span>Đăng ký</span>
            </SignUp>
          </Button>
          </div>
          <p className="text-xs text-gray-500 italic mt-4">Status: 401 - Unauthorized</p>
        </div>
        <Image alt="" src="/book2.png" height={400} width={400} className="max-lg:" />
      </div>
    )
  }

  return children;
}
