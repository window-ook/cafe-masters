import { Layers } from 'lucide-react';

export default function Categories({ categories }: { categories: string[] }) {
  return (
    <section className="col-span-2 grid grid-cols-3">
      {/* 왼쪽 */}
      <div className="col-span-1 flex gap-1 items-center">
        <Layers className='size-4' />
        <span className="font-medium">카테고리</span>
      </div>
      {/* 오른쪽 */}
      <div className="col-span-2 flex flex-wrap gap-2 text-md">
        {categories?.map(element => (
          <div
            key={element}
            className="px-3 py-1 rounded-full bg-main text-white"
          >
            {element}
          </div>
        ))}
      </div>
    </section>
  );
}