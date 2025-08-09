/** 카테고리 선택 타입 */
export interface ICategorySelector {
    selectedCategories: string[];
    setSelectedCategoriesAction: (categories: string[]) => void;
}
