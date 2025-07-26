export default function Skeleton({ width, height }: { width: string; height: string }) {
  return (
    <div
      className={`${width} ${height} rounded-sm bg-neutral-100 animate-skeleton opacity-50`}
    />
  );
}
