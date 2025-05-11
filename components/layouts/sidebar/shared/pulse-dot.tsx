export default function PulseDot() {
  return (
    <div className="w-full h-8 flex justify-center items-center gap-8">
      <div className="w-[1rem] h-[1rem] rounded-full bg-main animate-[dotOne_1s_ease-in-out_infinite]"></div>
      <div className="w-[1rem] h-[1rem] rounded-full bg-main animate-[dotTwo_1s_ease-in-out_infinite]"></div>
      <div className="w-[1rem] h-[1rem] rounded-full bg-main animate-[dotThree_1s_ease-in-out_infinite]"></div>
    </div>
  );
}
