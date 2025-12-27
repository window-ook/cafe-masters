import Link from 'next/link';

export default function SignInButton() {
  return (
    <Link
      href="/signin"
      data-testid="button-go-to-signin-from-main"
      className="bg-main hover:bg-main-600 flex w-full justify-center rounded-xl py-4 text-2xl font-semibold text-white shadow-md transition duration-150 ease-in sm:py-2 sm:text-lg"
    >
      로그인
    </Link>
  );
}
