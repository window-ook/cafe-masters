import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.cafe-masters.com';

  const staticPages: MetadataRoute.Sitemap = [
    // 랜딩페이지
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // 메인페이지
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
  ];

  return staticPages;
}