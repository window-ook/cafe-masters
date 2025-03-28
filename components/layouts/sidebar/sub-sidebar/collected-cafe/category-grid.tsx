interface CategoryGridProps {
  category: string[];
}

export default function CategoryGrid({ category }: CategoryGridProps) {
  return (
    <div className="col-span-2 grid grid-cols-3">
      <div className="col-span-1 flex gap-1 items-center">
        <span className="font-dpixel">카테고리</span>
      </div>
      <div className="col-span-2 text-md">
        {category?.map(element => (
          <span key={element} className="px-2 py-1 bg-main-light rounded-full">
            {element}
          </span>
        ))}
      </div>
    </div>
  );
}
