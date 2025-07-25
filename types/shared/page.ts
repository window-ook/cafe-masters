/** 페이지 Props 타입 */
export interface PageProps {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

/** 클라이언트 컴포넌트에서 사용할 페이지 Props 타입 */
export interface ClientPageProps {
    params: Promise<{ id: string }>;
}

/** URL 파라미터 타입 */
export interface UrlParams {
    id: string;
} 