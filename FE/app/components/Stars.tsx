'use client';

import { cn } from '@/app/lib/utils';
import { StarIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface StartsProps {
  value: number;
  className?: string;
  onChange?: (value: number) => void;
  changeable?: boolean;
}

export default function Stars({
  value,
  className,
  changeable,
  onChange,
}: StartsProps) {
  const [rate, setRate] = useState(value);

  return (
    <div
      className={cn(
        'relative flex items-center',
        className,
        changeable && 'cursor-pointer',
      )}
    >
      <div className="flex items-center text-gray-200 -space-x-[0.125em]">
        {[...Array(5)].map((_, index) => (
          <StarIcon
            key={index}
            className={cn('h-[1em]', index < rate && 'text-banana-mania-400')}
            onClick={() => {
              setRate(index + 1);
              onChange?.(index + 1);
            }}
          />
        ))}
      </div>
      {!changeable && (
        <div
          className="flex items-center -space-x-[0.125em] text-banana-mania-400 absolute"
          style={{
            clipPath: `polygon(0 0, ${(rate / 5) * 100}% 0%, ${
              (rate / 5) * 100
            }% 100%, 0% 100%)`,
          }}
        >
          <StarIcon className="h-[1em]" />
          <StarIcon className="h-[1em]" />
          <StarIcon className="h-[1em]" />
          <StarIcon className="h-[1em]" />
          <StarIcon className="h-[1em]" />
        </div>
      )}
    </div>
  );
}
