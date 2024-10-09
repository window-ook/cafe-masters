'use client';

import { cafeDatail } from 'actions/detailActions';
import { useEffect } from 'react';
import { useMapStore } from 'utils/store';

export default function CafeDetailPage({ params }) {
  const { id } = params;
  const setCafeDetail = useMapStore((state) => state.setCafeDetail);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(id);
        const response = await cafeDatail(id);
        console.log(response);
        setCafeDetail(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  return null;
}
