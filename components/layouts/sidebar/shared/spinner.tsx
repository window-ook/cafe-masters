interface SpinnerProps {
  width: string;
  height: string;
  border: string;
}

export default function Spinner({ width, height, border }: SpinnerProps) {
  return (
    <div
      className={`${width} ${height} ${border} border-main border-r-main-shadow border-b-main-light border-t-transparent rounded-full animate-spin`}
    ></div>
  );
}
