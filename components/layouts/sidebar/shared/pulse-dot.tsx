export default function PulseDot() {
  return (
    <div className="w-full h-8 flex justify-center items-center gap-8 animate-pulse">
      <div className="w-[1rem] h-[1rem] rounded-full bg-main"></div>
      <div className="w-[1rem] h-[1rem] rounded-full bg-main"></div>
      <div className="w-[1rem] h-[1rem] rounded-full bg-main"></div>
    </div>
  );
}
