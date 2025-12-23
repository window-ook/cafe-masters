const SIZE_CLASSES = {
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '120px': 'text-[120px]',
} as const;

export default function Logo({ size = '3xl' }: { size?: '3xl' | '4xl' | '5xl' | '120px' }) {
    const sizeClass = SIZE_CLASSES[size];

    return (
        <div className="flex items-center gap-1">
            <span className={`font-black ${sizeClass} leading-[0.9] text-white logo-text-shadow`}>
                CAFE
            </span>
            <span className={`font-black ${sizeClass} leading-[0.9] text-main logo-text-shadow`}>
                MASTERS
            </span>
        </div>
    );
}