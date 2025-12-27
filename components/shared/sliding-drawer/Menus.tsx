import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shadcn-ui/accordion';

interface IMenus {
  menus?: Array<{
    name: string;
    price: string;
    description?: string;
  }> | null;
  isDarkTheme: boolean;
  isPending?: boolean;
}

export default function Menus({
  menus,
  isDarkTheme,
  isPending = false,
}: IMenus) {
  if (isPending && (!menus || menus.length === 0)) {
    return (
      <div className="w-full">
        <div className="skeleton-shimmer mb-4 h-12 w-full rounded-lg" />
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-lg p-3 shadow-md">
              <div className="flex items-start justify-between">
                <div className="skeleton-shimmer h-5 w-24 rounded" />
                <div className="skeleton-shimmer h-5 w-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!menus || menus.length === 0)
    return (
      <div className="text-description w-full p-4 text-center font-medium">
        더 많은 정보를 보려면 썸네일 클릭
      </div>
    );

  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="menus">
          <AccordionTrigger className="cursor-pointer text-lg font-semibold">
            메뉴 보기 ({menus.length}개)
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="flex flex-col gap-3">
              {menus.map((menu, index) => (
                <div
                  key={index}
                  className={`flex flex-col gap-1 p-3 shadow-md ${isDarkTheme ? 'shadow-dark-shadow' : ''} rounded-lg`}
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-base font-medium">{menu.name}</h4>
                    <span className="text-positive text-sm font-semibold">
                      {menu.price}
                    </span>
                  </div>
                  {menu.description && (
                    <p className="text-description text-sm">
                      {menu.description}
                    </p>
                  )}
                </div>
              ))}
              <p>더 다양한 메뉴를 보려면 썸네일 클릭</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
