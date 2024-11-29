'use client';

import LogoutButton from './logout-button';
import ProfileBox from './profile-box';

export default function Footer() {
  return (
    <div className={`flex flex-col gap-10 items-center`}>
      <ProfileBox />
      <LogoutButton />
    </div>
  );
}
