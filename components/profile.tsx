'use server';

import { createServerSupabaseClient } from 'utils/supabase/server';

export default async function profile() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return (
    <div className="flex items-center gap-4">
      <img
        src="https://docs.material-tailwind.com/img/face-2.jpg"
        alt="avatar"
        className="relative inline-block object-cover object-center w-12 h-12 rounded-lg"
      />
      <div>
        <h6 className="text-slate-800 font-semibold">
          {session?.user?.email?.split('@')?.[0]}!
        </h6>
        <p>주니어</p>
      </div>
    </div>
  );
}
