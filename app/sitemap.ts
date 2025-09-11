import { MetadataRoute } from 'next';
import { getRecommendationCafesForSitemap } from '@/actions/supabase/recommendation/getData';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://app.cafe-masters.co';

  // 기본 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    // 랜딩페이지
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // 메인 (사이드바 탭)
    {
      url: `${baseUrl}/main`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // 검색 결과
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    // 수집한 카페
    {
      url: `${baseUrl}/collection`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    // 북마크한 카페
    {
      url: `${baseUrl}/bookmark`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // 추천 카페
    {
      url: `${baseUrl}/recommendation`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    // 추천 카페 상세 페이지
    const { data: recommendationCafes } = await getRecommendationCafesForSitemap();
    recommendationCafes.forEach(cafe => {
      dynamicPages.push({
        url: `${baseUrl}/recommendation/detail/${cafe.id}`,
        lastModified: new Date(cafe.created_at),
        changeFrequency: 'always',
        priority: 0.9,
      });
    });
  } catch (error) {
    console.error('사이트맵 생성 중 오류 발생:', error);
  }

  return [...staticPages, ...dynamicPages];
}