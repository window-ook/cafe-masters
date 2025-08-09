'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';
import { RadioGroup, RadioGroupItem } from '@/components/shadcn-ui/radio-group';

interface IRatingSelector {
  maxStars?: number;
  value?: number;
  onChange?: (value: number) => void;
}

export default function RatingsSelector({
  maxStars = 5,
  value = 0,
  onChange,
}: IRatingSelector) {
  const [rating, setRating] = useState<number>(value);

  const handleRatingChange = (value: string) => {
    const numericValue = Number(value);
    setRating(numericValue);
    onChange?.(numericValue);
  };

  return (
    <RadioGroup
      className="flex gap-1"
      value={String(rating)}
      onValueChange={handleRatingChange}
    >
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        return (
          <RadioGroupItem
            key={starValue}
            value={String(starValue)}
            id={`star-${starValue}`}
            className="peer hidden"
          />
        );
      })}
      {Array.from({ length: maxStars }, (_, index) => {
        const starValue = index + 1;
        return (
          <label
            key={starValue}
            htmlFor={`star-${starValue}`}
            className={cn(
              'cursor-pointer transition-all',
              rating >= starValue ? 'text-yellow-500' : 'text-gray-300',
            )}
          >
            <Star
              className="w-6 h-6"
              fill={rating >= starValue ? 'currentColor' : 'none'}
            />
          </label>
        );
      })}
    </RadioGroup>
  );
}
