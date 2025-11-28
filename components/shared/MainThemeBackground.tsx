export default function MainThemeBackground() {
    return (
        <>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-main-900 to-green-900" />
            <div className="absolute -left-20 top-20 size-96 animate-pulse rounded-full bg-main/30 blur-3xl" />
            <div className="absolute -right-20 bottom-20 size-96 animate-pulse rounded-full bg-purple-200/50 blur-3xl delay-1000" />
            <div className="absolute left-1/2 top-1/3 size-64 animate-pulse rounded-full bg-main-light/20 blur-3xl delay-500" />
        </>
    );
}