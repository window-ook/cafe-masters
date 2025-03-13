'use client';

import ProfileBox from '../footer/profile-box';
import LogoutButton from './logout-button';

export default function Footer() {
  return (
    <div className="w-full max-w-[27rem] pb-4 flex flex-col gap-6 items-center">
      <div className="h-[0.1rem] w-[97%] bg-gray-200 rounded-full"></div>
      <ProfileBox />
      <LogoutButton />
    </div>
  );
}
