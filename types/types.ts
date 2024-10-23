export interface PageProps {
  params: {
    id: string;
  };
}

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
