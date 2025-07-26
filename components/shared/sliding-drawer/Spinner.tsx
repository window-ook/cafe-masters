export default function Spinner({ width, height, border }: { width: string; height: string; border: string }) {
  return (
    <div
      className={`${width} ${height} ${border} border-main border-t-transparent rounded-full animate-spin`}
    ></div>
  );
}
