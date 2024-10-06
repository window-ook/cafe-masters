import Profile from './profile';
import LogoutButton from './logout-button';

export default function Footer({ session }) {
  return (
    <div className="flex justify-center items-center">
      <LogoutButton />
    </div>
  );
}
