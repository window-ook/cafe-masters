'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '*/lib/utils';
import { RadioGroup, RadioGroupItem } from '*/components/ui/radio-group';

interface StarRatingProps {
  maxStars?: number; // 기본 별 개수 (5개)
  value?: number; // 초기 값
  onChange?: (value: number) => void; // 값 변경 핸들러
}

export default function Rating({
  maxStars = 5,
  value = 0,
  onChange,
}: StarRatingProps) {
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
