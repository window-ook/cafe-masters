'use client';

import Badge from './badge';

export default function Profile({ session }) {
  return (
    <div className="flex justify-center items-center gap-4">
      <img
        src="https://docs.material-tailwind.com/img/face-2.jpg"
        alt="avatar"
        className="relative inline-block object-cover object-center w-12 h-12 rounded-lg"
      />
      <div className="flex gap-1">
        <h6 className="text-slate-800 font-semibold">
          {session?.user?.email?.split('@')?.[0]}
        </h6>
        <Badge tier={'MASTER'} />
      </div>
    </div>
  );
}
