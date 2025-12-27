import { Layers } from 'lucide-react';

export default function Categories({ categories }: { categories: string[] }) {
  return (
    <section className="col-span-2 grid grid-cols-3">
      {/* 왼쪽 */}
      <div className="col-span-1 flex items-center gap-1">
        <Layers className="size-4" />
        <span className="font-medium">카테고리</span>
      </div>
      {/* 오른쪽 */}
      <div className="text-md col-span-2 flex flex-wrap gap-2">
        {categories?.map(element => (
          <div
            key={element}
            className="bg-main rounded-full px-3 py-1 text-white"
          >
            {element}
          </div>
        ))}
      </div>
    </section>
  );
}
