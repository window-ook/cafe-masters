'use client';

export default function CollectedBadge() {
  return (
    <div
      data-cy="collected-badge"
      className="w-[7rem] h-6 py-4 rounded-xl shadow-md bg-gradient-to-r from-collected-side via-collected-center to-collected-side bg-[length:200%_200%] animate-gradient flex items-center justify-center"
    >
      <span className="font-pretendard font-bold text-white">COLLECTED</span>
    </div>
  );
}
