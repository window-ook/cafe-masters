// Detail
export interface CafeDetail {
  id: number;
  userId: string;
  name: string;
  photoUrl?: string | null;
  rating?: number | null;
  openWeekly?: string | null;
  openWeekend?: string | null;
  address: string;
  phoneNum?: string | null;
  coordX: number | null;
  coordY: number | null;
}

export interface NormalCafeDetail extends CafeDetail {
  reviewCount?: number | null;
  menu?: string | null;
}

export interface CollectedCafeDetail extends CafeDetail {
  comment: string;
  pros?: string | null;
  cons?: string | null;
  eaten: string;
  concept?: string | null;
}

// From Supabase
export interface CollectedCafeFromSupabase extends CafeDetail {
  comment: string;
  pros?: string | null;
  cons?: string | null;
  eaten: string;
  concept?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface CollectedCountFromSupabase {
  data: CollectedCafeFromSupabase[] | null;
  count: number | null;
}

export interface BookmarkedCafeFromSupabase extends NormalCafeDetail {
  created_at: string;
}

// Props
export interface MemoProps {
  detail: NormalCafeDetail;
  collectedCafeDetail: CollectedCafeDetail;
  bookmarkedCafeDetail: NormalCafeDetail;
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

export interface PageProps {
  params: {
    id: string;
  };
}

export interface CardProps {
  name: string;
  address: string;
  phoneNum: string;
  onClick: () => void;
}

export interface NormalCardProps extends CardProps {}

export interface CollectedCardProps extends CardProps {
  photoUrl: string;
  ratings: number;
}

export interface CafeDetailProps {
  setMemoOpen: (open: boolean) => void;
}

export interface CollectedCafeDetailProps extends CafeDetailProps {}

export interface NormalCafeDetailProps extends CafeDetailProps {
  detail: NormalCafeDetail;
  menuOpen: boolean;
  handleMenuOpen: () => void;
}

export type Tier = 'BEGINNER' | 'JUNIOR' | 'SENIOR' | 'EXPERT' | 'MASTER';
export interface TierBadgeProps {
  tier: Tier;
}

export interface BadgeProps extends TierBadgeProps {
  range: string;
  color: string;
}
