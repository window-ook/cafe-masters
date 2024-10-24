export interface PageProps {
  params: {
    id: string;
  };
}

export interface CafeDetail {
  id: number;
  userId: string;
  name: string;
  photoUrl?: string | null;
  reviewCount?: number | null;
  rating?: number | null;
  openWeekly?: string | null;
  openWeekend?: string | null;
  address: string;
  phoneNum?: string | null;
  menu?: string | null;
  coordX: number | null;
  coordY: number | null;
}

export interface CollectedCafeDetail {
  id: number;
  userId: string;
  name: string;
  photoUrl?: string | null;
  rating: number;
  openWeekly?: string | null;
  openWeekend?: string | null;
  address: string;
  phoneNum?: string | null;
  coordX: number | null;
  coordY: number | null;
  comment: string;
  pros?: string | null;
  cons?: string | null;
  eaten: string;
  concept?: string | null;
}

export interface NormalCardDetailProps {
  detail: CafeDetail;
  handleMenuOpen: () => void;
  setMemoOpen: (open: boolean) => void;
  menuOpen: boolean;
}

export interface MemoProps {
  detail: CafeDetail;
  collectedCafeDetail: CollectedCafeDetail;
  bookmarkedCafeDetail: CafeDetail;
  setComment: (comment: string) => void;
  setPros: (pros: string) => void;
  setCons: (cons: string) => void;
  setEaten: (eaten: string) => void;
  setConcept: (concept: string) => void;
  isDarkTheme: boolean;
  setMemoOpen: (open: boolean) => void;
  setRating: (rating: number) => void;
  rating: number;
}

// 액션 함수
export interface BookmarkedCafe {
  id: number;
  userId: string;
  name: string;
  photoUrl?: string | null;
  reviewCount?: number | null;
  rating?: number | null;
  openWeekly?: string | null;
  openWeekend?: string | null;
  address: string;
  phoneNum?: string | null;
  menu?: string | null;
  coordX: number | null;
  coordY: number | null;
  created_at: string;
}
export interface CollectedCafe {
  id: number;
  userId: string;
  name: string;
  photoUrl?: string | null;
  address: string;
  openWeekly?: string | null;
  openWeekend?: string | null;
  phoneNum?: string | null;
  coordX: number | null;
  coordY: number | null;
  comment: string;
  pros?: string | null;
  cons?: string | null;
  eaten: string;
  concept?: string | null;
  rating: number;
  created_at: string;
  updated_at?: string | null;
}

export interface CollectedCount {
  data: CollectedCafe[] | null;
  count: number | null;
}

export interface CollectedCardDetailProps {
  setMemoOpen: (boolean: boolean) => void;
}

export interface CommentGridProps {
  comment: string;
}

export interface ConceptGridProps {
  concept: string;
}

export interface RatingGridProps {
  rating: number;
}

export interface ConsGridProps {
  cons: string;
}
export interface ProsGridProps {
  pros: string;
}

export interface EatenGridProps {
  eaten: string;
}

export interface LocationGridProps {
  address: string;
}

interface MenuItem {
  menu: string;
  price: string;
}

export interface MenuGridProps {
  isDarkTheme: boolean;
  handleMenuOpen: () => void;
  menuOpen: boolean;
  menu: MenuItem[];
}

export interface PhoneNumGridProps {
  phoneNum: string | null | undefined;
}

export interface OpenTimeGridProps {
  openWeekly: string | null | undefined;
  openWeekend: string | null | undefined;
}

export interface ReviewAndRatingGridProps {
  reviewCount: number | null | undefined;
  rating: number | null | undefined;
}
