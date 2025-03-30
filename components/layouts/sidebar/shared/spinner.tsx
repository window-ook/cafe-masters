interface SpinnerProps {
  size: string;
  border: string;
}

export default function Spinner({ size = '2', border = '4' }: SpinnerProps) {
  return (
    <div
      className={`w-[${size}rem] h-[${size}rem] border-${border} border-main border-r-main-shadow border-b-main-light border-t-transparent rounded-full animate-spin`}
    ></div>
  );
}
