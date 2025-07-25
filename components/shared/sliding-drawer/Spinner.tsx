'use client';

interface ISpinner {
  width: string;
  height: string;
  border: string;
}

export default function Spinner({ width, height, border }: ISpinner) {
  return (
    <div
      className={`${width} ${height} ${border} border-main border-t-transparent rounded-full animate-spin`}
    ></div>
  );
}
