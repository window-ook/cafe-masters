import Link from 'next/link';

export default function SignInButton() {
  return (
    <Link
      href='/signin'
      data-testid="button-go-to-signin-from-main"
      className="w-full py-4 rounded-xl shadow-md bg-main flex justify-center text-white text-2xl font-semibold transition duration-150 ease-in hover:bg-main-600 sm:py-2 sm:text-lg"
    >
      로그인
    </Link>
  );
}