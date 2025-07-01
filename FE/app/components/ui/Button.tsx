import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/app/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[0.625rem] text-sm font-semibold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-primary-950 dark:focus-visible:ring-primary-300 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary-700 text-primary-50 hover:bg-primary-700/90',
        outline:
          'border-[2px] border-primary-700 text-primary-700 bg-white hover:bg-primary-50',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-9 px-4 rounded-md',
        xs: 'h-8 px-4 rounded-md',
        lg: 'h-11 px-8',
        icon: 'w-10 h-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
