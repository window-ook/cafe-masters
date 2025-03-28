export interface SearchResult {
  id: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  x: number;
  y: number;
  place_name: string;
  place_url: string;
  address_name: string;
  road_address_name: string;
  distance: string;
  phone: string;
}

export interface FetchedCafeDetail {
  photo?: string;
  photoList?: string[];
  openingHours?: string | undefined;
  address?: string;
  menu?: string[];
}

export interface NormalCafeDetailForBookmark {
  id: number;
  userId: string;
  coordX: number;
  coordY: number;
  name: string;
  photoUrl?: string | null;
  photoList?: string[] | null;
  rating?: number | null;
  openingHours?: string | undefined;
  address: string;
  phoneNum?: string | null;
  menu?: string | null;
}

export interface NormalCafeDetailForRecommend {
  id: number;
  coordX: number;
  coordY: number;
  name: string;
  category: string;
  photoUrl?: string | null;
  photoList?: string[] | null;
  openingHours?: string | undefined;
  address: string;
  phoneNum?: string | null;
  menu?: string | null;
}

export interface CollectedCafeDetailForUpdate {
  id: number;
  userId: string;
  coordX: number;
  coordY: number;
  name: string;
  category: string | null;
  photoUrl?: string | null;
  rating?: number | null;
  openingHours?: string;
  address: string;
  phoneNum?: string | null;
  comment: string;
  pros?: string | null;
  cons?: string | null;
  eaten: string;
}

// 수파베이스에서 가져온 수집한 카드
export interface CollectedCafeFromSupabase
  extends CollectedCafeDetailForUpdate {
  created_at: string;
  updated_at?: string | null;
}

// 수파베이스에서 가져온 북마크 카페
export interface BookmarkedCafeFromSupabase
  extends NormalCafeDetailForBookmark {
  created_at: string;
  photoList?: string[];
}

export interface RecommendedCafeFromSupabase
  extends NormalCafeDetailForRecommend {
  created_at: string;
  photoList?: string[];
}

export interface PageProps {
  params: Promise<{ id: string }>;
}

export type Tier = 'BEGINNER' | 'JUNIOR' | 'SENIOR' | 'EXPERT' | 'MASTER';

export interface BadgeProps {
  tier: Tier;
  range: string;
  color: string;
}
