import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="flex items-center space-x-2 whitespace-nowrap text-ellipsis overflow-hidden font-semibold text-sm text-primary-700">
      {items.map(({ href, label }, index) => (
        <span key={index}>
          <Link key={index} href={href}>
            {label}
          </Link>
          {index < items.length - 1 && <span className="ml-2">/</span>}
        </span>
      ))}
    </div>
  );
}
