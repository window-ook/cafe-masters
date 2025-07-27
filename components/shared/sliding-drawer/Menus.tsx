import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/shadcn-ui/accordion';

interface IMenus {
    menus?: Array<{
        name: string;
        price: string;
        description?: string;
    }>;
}

export default function Menus({ menus }: IMenus) {
    if (!menus || menus.length === 0) {
        return (
            <div className="w-full p-4 text-center text-description">
                메뉴 정보가 없습니다.
            </div>
        );
    }

    return (
        <div className="w-full">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="menus">
                    <AccordionTrigger className="text-lg font-semibold cursor-pointer">
                        메뉴 보기 ({menus.length}개)
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="flex flex-col gap-3">
                            {menus.map((menu, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-1 p-3 shadow-md rounded-lg"
                                >
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-medium text-base">{menu.name}</h4>
                                        <span className="text-positive font-semibold text-sm">
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

