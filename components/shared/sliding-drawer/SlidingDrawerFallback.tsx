import { LoadingSpinner } from './LoadingSpinner';

export default function SlidingDrawerSkeleton() {
  return (
    <article className="size-full">
      <LoadingSpinner size="xl" className="size-full" />
    </article>
  );
}
