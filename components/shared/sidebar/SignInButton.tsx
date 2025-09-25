import Link from 'next/link';

export default function SignInButton() {
    return (
        <Link
            href='/signin'
            data-testid="button-go-to-signin-from-main"
            className="bg-main rounded-xl shadow-md w-full py-4 sm:py-2 hover:bg-main-dark flex justify-center cursor-pointer transition duration-150 ease-in"
        >
            <span className="text-white text-2xl font-semibold sm:text-lg">로그인</span>
        </Link>
    );
}