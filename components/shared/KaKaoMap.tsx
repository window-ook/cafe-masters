'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useMapStore, useCafeStore, useFilterStore, useUserStore } from '@/stores';
import { IKakaoSearchResult } from '@/types/kakao-map/kakao-map';
import { toast } from 'react-toastify';
import { useCollectedCafes } from '@/hooks/supabase/useCollectedCafes';
import { useBookmarkedCafes } from '@/hooks/supabase/useBookmarkedCafes';
import { useRecommendedCafes } from '@/hooks/supabase/useRecommendedCafes';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    kakao: any;
  }
}

interface IKakaoPagination {
  current: number;
  hasNextPage: boolean;
  nextPage: () => void;
}

export default function KakaoMap() {
  const pathname = usePathname();
  const { userId } = useUserStore();

  const { keyword } = useFilterStore();
  const { searchResult, setSearchResult } = useCafeStore();
  const { filteredData: collectedCafes } = useCollectedCafes(userId, true);
  const { filteredData: bookmarkedCafes } = useBookmarkedCafes(userId, true);
  const { recommendedCafes } = useRecommendedCafes();
  const { currentCoordX, currentCoordY } = useMapStore();

  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  const mapRef = useRef<any | null>(null);
  const openInfoWindowRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const prevMarkerDataRef = useRef<any[] | null>(null);
  const prevKeywordRef = useRef<string | null>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(
            37.54715716085294,
            127.04663357436208,
          ),
          level: 7,
          draggable: true,
        };
        const zoomControl = new window.kakao.maps.ZoomControl();

        mapRef.current = new window.kakao.maps.Map(container, options);
        mapRef.current.addControl(
          zoomControl,
          window.kakao.maps.ControlPosition.RIGHT,
        );

        setMapLoaded(true);
      });
    };

    return () => {
      script.remove();
    };
  }, []);

  // 마커 제거
  const removeMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  // 정보창 제거
  const removeInfoWindows = () => {
    if (openInfoWindowRef.current) {
      openInfoWindowRef.current.close();
      openInfoWindowRef.current = null;
    }
  };

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const updateMarkers = (
      data: any[],
      getLat: (item: any) => number,
      getLng: (item: any) => number,
    ) => {
      if (prevMarkerDataRef.current === data) return;
      if (!data || !Array.isArray(data)) return;
      prevMarkerDataRef.current = data;

      const map = mapRef.current;

      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      markersRef.current = data.map(item => {
        const position = new window.kakao.maps.LatLng(
          getLat(item),
          getLng(item),
        );
        const marker = new window.kakao.maps.Marker({ map, position });
        const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

        const createInfoWindows = () => {
          infowindow.setContent(
            `<div aria-label='kakao map marker' style="padding: 1rem 2rem 1rem 2rem; font-size:1rem; white-space:nowrap">${item.place_name || item.name}</div>`,
          );
          infowindow.open(map, marker);

          openInfoWindowRef.current = infowindow;
        };

        const showInfoWindow = () => {
          removeInfoWindows();
          createInfoWindows();
        };

        const hideInfoWindow = () => infowindow.close();

        if (window.innerWidth > 768) {
          window.kakao.maps.event.addListener(marker, 'mouseover', showInfoWindow);
          window.kakao.maps.event.addListener(marker, 'mouseout', hideInfoWindow);
        } else {
          window.kakao.maps.event.addListener(marker, 'click', showInfoWindow);
          window.kakao.maps.event.addListener(map, 'click', hideInfoWindow);
        }

        return marker;
      });
    };

    const searchCafes = async (query: string) => {
      if (prevKeywordRef.current === query) return;
      prevKeywordRef.current = query;

      const map = mapRef.current;
      if (!map) return;

      const ps = new window.kakao.maps.services.Places();

      let allResults: IKakaoSearchResult[] = [];

      const handleSearch = (
        data: IKakaoSearchResult[],
        status: string,
        pagination: IKakaoPagination,
      ) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const filteredData = data.filter(item => item.category_group_code === 'CE7');

          allResults = [...allResults, ...filteredData];

          if (pagination.hasNextPage && allResults.length < 45) {
            pagination.nextPage();
          } else {
            setSearchResult(allResults);
            updateMarkers(
              allResults,
              item => item.y,
              item => item.x,
            );
            mapRef.current.setCenter(new window.kakao.maps.LatLng(allResults[0].y, allResults[0].x));
          }
        } else {
          toast.warning(
            `${query.replace('카페', '').trim()}의 검색 결과가 없습니다`,
          );
        }
      };

      ps.keywordSearch(query, handleSearch);
    };

    if (pathname === '/cafe') {
      removeMarkers();
      removeInfoWindows();
    }

    if (pathname === '/search') {
      const query = keyword.includes('카페') ? keyword : `${keyword} 카페`;
      searchCafes(query);
    }

    if (pathname.startsWith('/search/detail')) {
      updateMarkers(
        searchResult,
        cafe => cafe.y,
        cafe => cafe.x,
      );
    }

    if (pathname.startsWith('/collected')) {
      updateMarkers(
        collectedCafes,
        cafe => cafe.coordY,
        cafe => cafe.coordX,
      );
    }

    if (pathname.startsWith('/bookmarked')) {
      updateMarkers(
        bookmarkedCafes,
        cafe => cafe.coordY,
        cafe => cafe.coordX,
      );
    }

    if (pathname.startsWith('/recommended')) {
      updateMarkers(
        recommendedCafes,
        cafe => cafe.coordY,
        cafe => cafe.coordX,
      );
    }

    if (
      pathname.startsWith('/search/detail') ||
      pathname.startsWith('/collected/detail') ||
      pathname.startsWith('/bookmarked/detail') ||
      pathname.startsWith('/recommended/detail')
    ) {
      mapRef.current.setCenter(
        new window.kakao.maps.LatLng(currentCoordY, currentCoordX),
      );
    }
  }, [
    mapLoaded,
    keyword,
    currentCoordX,
    currentCoordY,
    pathname,
    setSearchResult,
    searchResult,
    bookmarkedCafes,
    collectedCafes,
    recommendedCafes,
  ]);

  return (
    <figure
      aria-label="kakao map"
      id="map"
      className="fixed z-0 top-0 w-screen h-screen sm:translate-x-108 sm:w-[calc(100vw-27rem)]"
    ></figure>
  );
}
