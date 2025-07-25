'use client';

import ProfileSection from './ProfileSection';
import SignOutButton from './SignOutButton';

export default function Footer() {
  return (
    <section className="w-full max-w-108 pb-4 flex flex-col gap-6 items-center">
      <div className="h-[0.1rem] w-[97%] bg-gray-200 rounded-full"></div>
      <ProfileSection />
      <SignOutButton />
    </section>
  );
}
