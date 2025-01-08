// 카카오맵 카페 검색 결과
export interface AllCafe {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: number;
  y: number;
}

// sub-sidebar에서 저장을 위한 카페 상세 정보
export interface CafeDetailForUpload {
  id: number;
  userId: string;
  name: string;
  photoUrl?: string | null;
  rating?: number | null;
  openWeekly?: string | null;
  openWeekend?: string | null;
  address: string;
  phoneNum?: string | null;
  coordX: number;
  coordY: number;
}

export interface NormalCafeDetailForUpload extends CafeDetailForUpload {
  reviewCount?: number | null;
  menu?: string | null;
}

export interface CollectedCafeDetailForUpload extends CafeDetailForUpload {
  comment: string;
  pros?: string | null;
  cons?: string | null;
  eaten: string;
  concept?: string | null;
}

// API 리턴 상세 정보
export interface Feedback {
  scorecnt: number | undefined;
  scoresum: number | undefined;
}

export interface TimeInfo {
  timeSE: string;
}

export interface PeriodInfo {
  timeList: TimeInfo[];
}

export interface OpenHour {
  periodList: PeriodInfo[];
}

export interface Address {
  region: {
    newaddrfullname?: string;
  };
  newaddr: {
    newaddrfull?: string;
  };
  addrdetail?: string;
}

export interface BasicInfo {
  cid: number;
  placenamefull: string;
  mainphotourl?: string;
  feedback?: Feedback;
  openHour?: OpenHour;
  address?: Address;
  phonenum?: string;
}

export interface Comment {
  kamapComntcnt: number;
}

export interface MenuInfo {
  menuList?: string[];
}

export interface FetchedCafeDetail {
  basicInfo?: BasicInfo;
  comment?: Comment;
  menuInfo?: MenuInfo;
}

// 수파베이스에서 가져온 수집한 카드
export interface CollectedCafeFromSupabase
  extends CollectedCafeDetailForUpload {
  created_at: string;
  updated_at?: string | null;
}

// 수파베이스에서 가져온 북마크 카페
export interface BookmarkedCafeFromSupabase extends NormalCafeDetailForUpload {
  created_at: string;
}

// 컴포넌트 Props
export interface MemoProps {
  detail: NormalCafeDetailForUpload;
  collectedCafeDetail: CollectedCafeDetailForUpload;
  bookmarkedCafeDetail: NormalCafeDetailForUpload;
  comment: string;
  pros: string;
  cons: string;
  eaten: string;
  concept: string;
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
  params: Promise<{ id: string }>;
}

export type Tier = 'BEGINNER' | 'JUNIOR' | 'SENIOR' | 'EXPERT' | 'MASTER';

export interface BadgeProps {
  tier: Tier;
  range: string;
  color: string;
}
