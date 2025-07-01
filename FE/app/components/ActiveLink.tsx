'use client';

import { cn } from '@/app/lib/utils';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';

type ActiveLinkProps = {
  activeClassName?: string;
} & LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function ActiveLink({
  activeClassName,
  className,
  children,
  href,
  ...props
}: ActiveLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      {...props}
      className={cn(className, pathname === href && activeClassName)}
    >
      {children}
    </Link>
  );
}
