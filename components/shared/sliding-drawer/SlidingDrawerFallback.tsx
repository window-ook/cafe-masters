import { LoadingSpinner } from './LoadingSpinner';

export default function SlidingDrawerFallback() {
  return (
    <article className="size-full">
      <LoadingSpinner size="xl" className="size-full" />
    </article>
  );
}
