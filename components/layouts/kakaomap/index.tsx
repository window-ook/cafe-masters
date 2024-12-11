'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMapStore } from 'utils/store';
import { AllCafe } from 'types/common';
import { KakaoMapStyle } from 'utils/styles';
import { toast } from 'react-toastify';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoPagination {
  current: number;
  hasNextPage: boolean;
  nextPage: () => void;
}

export default function KakaoMap() {
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const openInfoWindowRef = useRef<any | null>(null);

  const keyword = useMapStore(state => state.keyword);
  const setAllCafe = useMapStore(state => state.setAllCafe);
  const allCafe = useMapStore(state => state.allCafe);
  const collectedCafe = useMapStore(state => state.collectedCafe);
  const bookmarkedCafe = useMapStore(state => state.bookmarkedCafe);
  const thisX = useMapStore(state => state.thisX);
  const thisY = useMapStore(state => state.thisY);

  const pathname = usePathname();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(
            37.54715716085294,
            127.04663357436208,
          ),
          level: 5,
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

  // 마커 업데이트
  const updateMarkers = (
    data: any[],
    getLat: (item: any) => number,
    getLng: (item: any) => number,
  ) => {
    const map = mapRef.current;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    markersRef.current = data.map(item => {
      const position = new window.kakao.maps.LatLng(getLat(item), getLng(item));
      const marker = new window.kakao.maps.Marker({ map, position });
      const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

      const createInfoWindows = () => {
        infowindow.setContent(
          `<div style="padding: 1rem 2rem 1rem 2rem; font-size:1rem; white-space:nowrap">${item.place_name || item.name}</div>`,
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
        window.kakao.maps.event.addListener(
          marker,
          'mouseover',
          showInfoWindow,
        );
        window.kakao.maps.event.addListener(marker, 'mouseout', hideInfoWindow);
      } else {
        window.kakao.maps.event.addListener(marker, 'click', showInfoWindow);
        window.kakao.maps.event.addListener(map, 'click', hideInfoWindow);
      }

      return marker;
    });
  };

  const removeMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  const removeInfoWindows = () => {
    if (openInfoWindowRef.current) {
      openInfoWindowRef.current.close();
      openInfoWindowRef.current = null;
    }
  };

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const searchCafes = (query: string) => {
      const map = mapRef.current;

      if (!map) return;

      const ps = new window.kakao.maps.services.Places();

      let allResults: AllCafe[] = [];

      const handleSearch = (
        data: AllCafe[],
        status: string,
        pagination: KakaoPagination,
      ) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const filteredData = data.filter(
            item => item.category_group_code === 'CE7',
          );

          allResults = [...allResults, ...filteredData];

          if (pagination.hasNextPage && allResults.length < 45) {
            pagination.nextPage();
          } else {
            setAllCafe(allResults);
            updateMarkers(
              allResults,
              item => item.y,
              item => item.x,
            );
          }
        } else {
          toast.warning(
            `${query.replace('카페', '').trim()}의 검색 결과가 없습니다`,
          );
        }
      };

      ps.keywordSearch(query, handleSearch);
    };

    if (pathname === '/') {
      removeMarkers();
      removeInfoWindows();
    }

    if (pathname === '/cafe/all') {
      const query = keyword.includes('카페') ? keyword : `${keyword} 카페`;
      searchCafes(query);
    }

    if (pathname.startsWith('/cafe/all/detail')) {
      updateMarkers(
        allCafe,
        cafe => cafe.y,
        cafe => cafe.x,
      );
    }

    if (pathname.startsWith('/cafe/collected')) {
      updateMarkers(
        collectedCafe,
        cafe => cafe.coordY,
        cafe => cafe.coordX,
      );
      mapRef.current.setCenter(new window.kakao.maps.LatLng(thisY, thisX));
    }

    if (pathname.startsWith('/cafe/bookmarked')) {
      updateMarkers(
        bookmarkedCafe,
        cafe => cafe.coordY,
        cafe => cafe.coordX,
      );
      mapRef.current.setCenter(new window.kakao.maps.LatLng(thisY, thisX));
    }

    if (
      pathname.startsWith('/cafe/all/detail') ||
      pathname.startsWith('/cafe/collected/detail') ||
      pathname.startsWith('/cafe/bookmarked/detail')
    ) {
      mapRef.current.setCenter(new window.kakao.maps.LatLng(thisY, thisX));
    }
  });

  return <div id="map" className={KakaoMapStyle} />;
}
