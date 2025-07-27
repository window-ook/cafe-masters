import Link from 'next/link';

export default function SignInButton() {
    return (
        <Link
            href='/signin'
            className="bg-main rounded-xl shadow-md w-full py-4 sm:py-2 hover:bg-main-dark flex justify-center cursor-pointer transition duration-300 ease-in"
        >
            <span className="text-white  text-2xl sm:text-lg">로그인</span>
        </Link>
    );
}