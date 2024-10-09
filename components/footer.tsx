'use client';

import LogoutButton from './logout-button';
import Profile from './profile';

export default function Footer({ session }) {
  return (
    <div className="flex flex-col gap-10 items-center">
      <Profile session={session} />
      <LogoutButton />
    </div>
  );
}
