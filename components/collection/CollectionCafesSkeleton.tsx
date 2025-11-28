import { useUIStore } from '@/stores';

export default function CollectionCafesSkeleton() {
    const isDarkTheme = useUIStore(state => state.isDarkTheme);

    return (
        <div className="h-full flex flex-col">
            <section className="pagination-sidebar-list flex-1 overflow-y-auto">
                {Array.from({ length: 1 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-80 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
                    />
                ))}
            </section>
            <footer className={`w-full py-4 flex-shrink-0 ${isDarkTheme ? 'bg-dark-background' : 'bg-sidebar-background'} font-dunggeunmo`}>
                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        className="px-4 py-2"
                    >
                        <span className="text-3xl ">{'<'}</span>
                    </button>
                    <p className="text-2xl ">
                        1 / -
                    </p>
                    <button
                        type="button"
                        className="px-4 py-2"
                    >
                        <span className="text-3xl ">{'>'}</span>
                    </button>
                </div>
            </footer>
        </div>
    );
}
