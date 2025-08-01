import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://app.cafe-masters.co',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          ko: 'https://app.cafe-masters.co/ko',
          en: 'https://app.cafe-masters.co/en',
        },
      },
    },
    {
      url: 'https://app.cafe-masters.co/search',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: {
        languages: {
          ko: 'https://app.cafe-masters.co/ko',
          en: 'https://app.cafe-masters.co/en',
        },
      },
    },
    {
      url: 'https://app.cafe-masters.co/collection',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: {
        languages: {
          ko: 'https://app.cafe-masters.co/ko',
          en: 'https://app.cafe-masters.co/en',
        },
      },
    },
    {
      url: 'https://app.cafe-masters.co/bookmark',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: {
        languages: {
          ko: 'https://app.cafe-masters.co/ko',
          en: 'https://app.cafe-masters.co/en',
        },
      },
    },
  ];
}
