import * as React from 'react';

import { cn } from '@/app/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

const inputVariants = cva(
  'flex h-10 w-full rounded-[0.625rem] border-[1.25px] px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-primary-700 bg-white focus-visible:ring-primary-900/50',
        secondary: 'border-gray-300 bg-white focus-visible:ring-gray-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ className, variant }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
