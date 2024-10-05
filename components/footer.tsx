import Profile from './profile';
import LogoutButton from './logout-button';

export default function Footer({ session }) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <Profile session={session} />
      <LogoutButton />
    </div>
  );
}
