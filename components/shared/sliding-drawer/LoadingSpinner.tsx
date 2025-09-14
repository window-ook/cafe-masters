interface ILoadingSpinner {
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    className?: string;
}

const sizeClasses = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-8',
    xl: 'size-10',
    '2xl': 'size-12'
};

export function LoadingSpinner({ size = 'lg', className = '' }: ILoadingSpinner) {
    const spinnerSize = sizeClasses[size];

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="relative">
                <div className={`rounded-full border-4 border-gray-200 ${spinnerSize}`}></div>
                <div className={`absolute top-0 left-0 rounded-full border-4 border-transparent border-t-main animate-spin ${spinnerSize}`}></div>
            </div>
        </div>
    );
}