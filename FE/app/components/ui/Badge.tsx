import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/app/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-lg border border-primary-200 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-950 focus:ring-offset-2 dark:border-primary-800 dark:focus:ring-primary-300',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-700 text-primary-50 hover:bg-primary-700/80',
        secondary:
          'border-transparent bg-tower-gray-300 text-white hover:bg-primary-100/80',
        outline: 'border-primary-700 bg-white text-primary-700',
      },
      size: {
        default: 'px-2.5 py-0.5',
        sm: 'px-1 text-xs',
        lg: 'px-2.5 py-0.5 text-sm font-bold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
