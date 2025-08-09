export default function PulseDot() {
  return (
    <div className="w-full h-8 flex justify-center items-center gap-8">
      <div className="w-4 h-4 rounded-full bg-main animate-dotOne"></div>
      <div className="w-4 h-4 rounded-full bg-main animate-dotTwo"></div>
      <div className="w-4 h-4 rounded-full bg-main animate-dotThree"></div>
    </div>
  );
}
