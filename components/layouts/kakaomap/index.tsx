'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMapStore } from 'utils/store';
import { KakaoMapStyle } from 'utils/styles';
import { toast } from 'react-toastify';
import { AllCafe } from 'types/common';

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
  const [mapLoaded, setMapLoaded] = useState(false); // 지도 로드 상태

  const mapRef = useRef<any | null>(null); // 지도 객체 저장
  const markersRef = useRef<any[]>([]); // 마커 관리

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

  // 마커 추가 및 삭제 함수
  const updateMarkers = (
    data: any[],
    getLat: (item: any) => number,
    getLng: (item: any) => number,
  ) => {
    const map = mapRef.current;
    if (!map) return;

    // 기존 마커 삭제
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 새로운 마커 추가
    markersRef.current = data.map(item => {
      const position = new window.kakao.maps.LatLng(getLat(item), getLng(item));
      const marker = new window.kakao.maps.Marker({ map, position });
      const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

      // 마커에 이벤트 추가
      if (window.innerWidth > 768) {
        window.kakao.maps.event.addListener(marker, 'mouseover', () => {
          infowindow.setContent(
            `<div style="padding: 1rem 2rem 1rem 2rem; font-size:1rem; white-space:nowrap">${item.place_name || item.name}</div>`,
          );
          infowindow.open(map, marker);
        });

        window.kakao.maps.event.addListener(marker, 'mouseout', () => {
          infowindow.close();
        });
      } else {
        window.kakao.maps.event.addListener(marker, 'click', function () {
          infowindow.setContent(
            `<div style="padding: 1rem 2rem 1rem 2rem; font-size:1rem; white-space:nowrap">${item.place_name || item.name}</div>`,
          );
          infowindow.open(map, marker);
        });

        window.kakao.maps.event.addListener(map, 'click', function () {
          infowindow.close();
        });
      }

      return marker;
    });
  };

  // 상태 기반 마커 처리
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    // 카페 검색
    const searchCafes = (query: string) => {
      const map = mapRef.current;

      if (!map) return;

      const ps = new window.kakao.maps.services.Places();

      let allResults: any[] = []; // 모든 결과를 저장할 배열

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

            if (allResults.length > 0) {
              mapRef.current.panTo(
                new window.kakao.maps.LatLng(allCafe[0].y, allCafe[0].x),
              );
            }

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
      updateMarkers(
        allCafe,
        cafe => cafe.y,
        cafe => cafe.x,
      );
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
    }

    if (pathname.startsWith('/cafe/bookmarked')) {
      updateMarkers(
        bookmarkedCafe,
        cafe => cafe.coordY,
        cafe => cafe.coordX,
      );
    }

    if (
      pathname.startsWith('/cafe/all/detail') ||
      pathname.startsWith('/cafe/collected/detail') ||
      pathname.startsWith('/cafe/bookmarked/detail')
    ) {
      mapRef.current.setCenter(new window.kakao.maps.LatLng(thisY, thisX));
    }
  }, [
    pathname,
    keyword,
    allCafe,
    setAllCafe,
    collectedCafe,
    bookmarkedCafe,
    thisX,
    thisY,
    mapLoaded,
  ]);

  return <div id="map" className={KakaoMapStyle} />;
}
