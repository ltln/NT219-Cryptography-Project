'use client';

import ActiveLink from '@/app/components/ActiveLink';
import SignIn from '@/app/components/SignIn';
import SignUp from '@/app/components/SignUp';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/components/ui/Avatar';
import { Button } from '@/app/components/ui/Button';
import { Separator } from '@/app/components/ui/Separator';
import routes from '@/app/configs/routes';
import { useAuth } from '@/app/lib/hooks/useAuth';
import {
  ArrowRightEndOnRectangleIcon,
  ClipboardDocumentListIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { PencilIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

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

  return (
    <div className="grid lg:grid-cols-12 gap-4">
      <div className="lg:col-span-3">
        <aside className="bg-white rounded-[0.625rem] p-4 pb-6 sticky top-20">
          <div className="flex items-center">
            <Avatar className="w-11 h-11">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>VA</AvatarFallback>
            </Avatar>

            <div className="ml-3">
              <h3 className="font-semibold text-primary-700">{user.username}</h3>
              <Link
                href={routes.profile}
                className="flex items-center text-sm text-gray-500"
              >
                <PencilIcon className="h-3.5 mr-1" />
                Chỉnh sửa
              </Link>
            </div>
          </div>

          <Separator />

          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center font-medium">
                <UserIcon className="h-6 mr-4 text-primary-700" />
                <span>Tài khoản</span>
              </div>

              <ul className="pl-10 space-y-2 mt-2">
                <li>
                  <ActiveLink
                    href={routes.profile}
                    activeClassName="text-primary-700 font-semibold"
                  >
                    Hồ sơ
                  </ActiveLink>
                </li>

                <li>
                  <ActiveLink
                    href={routes.changePassword}
                    activeClassName="text-primary-700 font-semibold"
                  >
                    Đổi mật khẩu
                  </ActiveLink>
                </li>
              </ul>
            </div>
            <ActiveLink
              href={routes.purchase}
              className="inline-flex items-center font-medium"
              activeClassName="text-primary-700 font-semibold"
            >
              <ClipboardDocumentListIcon className="h-6 mr-4 text-casal-700" />
              <span>Đơn mua</span>
            </ActiveLink>

            <button
              onClick={logout}
              className="flex items-center font-medium"
            >
              <ArrowRightEndOnRectangleIcon className="h-6 mr-4 text-donkey-brown-400" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>
      </div>
      <div className="lg:col-span-9">{children}</div>
    </div>
  );
}
