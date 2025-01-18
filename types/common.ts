// 카카오맵 검색 데이터 JSON
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

// 카카오플레이스 카페 상세 JSON
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

export interface PhotoItem {
  photoid: string;
  orgurl: string;
}

export interface PhotoList {
  photoCount: number;
  categoryName: string;
  list: PhotoItem[];
}

export interface Photo {
  photoList?: PhotoList[] | undefined;
}

export interface FetchedCafeDetail {
  basicInfo?: BasicInfo;
  comment?: Comment;
  menuInfo?: MenuInfo;
  photo?: Photo;
}

export interface NormalCafeDetailForBookmark {
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
  reviewCount?: number | null;
  menu?: string | null;
  photoList?: PhotoItem[] | null;
}

export interface CollectedCafeDetailForUpdate {
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
  comment: string;
  pros?: string | null;
  cons?: string | null;
  eaten: string;
  concept?: string | null;
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
  photoList?: PhotoItem[];
}

// 메모 컴포넌트
export interface MemoProps {
  detailName: string;
  collectedCafeDetailName: string;
  bookmarkedCafeDetailName: string;
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

// 페이지 컴포넌트 [id]
export interface PageProps {
  params: Promise<{ id: string }>;
}

// 티어 리터럴
export type Tier = 'BEGINNER' | 'JUNIOR' | 'SENIOR' | 'EXPERT' | 'MASTER';

// 티어 뱃지 컴포넌트
export interface BadgeProps {
  tier: Tier;
  range: string;
  color: string;
}
