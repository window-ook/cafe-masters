'use client';

interface CategoryGridProps {
  category: string[];
}

export default function CategoryGrid({ category }: CategoryGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1 items-center">
        <span className="font-dpixel">카테고리</span>
      </div>
      <div className="col-span-2 flex flex-wrap gap-2 text-md">
        {category?.map(element => (
          <div
            key={element}
            className="px-3 py-1 rounded-full bg-main text-white"
          >
            {element}
          </div>
        ))}
      </div>
    </div>
  );
}
