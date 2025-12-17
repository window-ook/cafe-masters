import CafeDetailSkeleton from '@/components/shared/sliding-drawer/CafeDetailSkeleton';

export default function SlidingDrawerFallback() {
  return (
    <article className="size-full">
      <CafeDetailSkeleton withHeader={true} />
    </article>
  );
}
