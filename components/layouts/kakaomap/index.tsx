'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMapStore } from 'utils/store';
import { SearchResult } from 'types/common';
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
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  const mapRef = useRef<any | null>(null);
  const openInfoWindowRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const prevMarkerDataRef = useRef<any[] | null>(null);
  const prevKeywordRef = useRef<string | null>(null);

  const keyword = useMapStore(state => state.keyword);
  const setSearchResult = useMapStore(state => state.setSearchResult);
  const searchResult = useMapStore(state => state.searchResult);
  const collectedCafe = useMapStore(state => state.collectedCafe);
  const bookmarkedCafe = useMapStore(state => state.bookmarkedCafe);
  const thisX = useMapStore(state => state.thisX);
  const thisY = useMapStore(state => state.thisY);

  const pathname = usePathname();

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
          window.kakao.maps.event.addListener(
            marker,
            'mouseover',
            showInfoWindow,
          );
          window.kakao.maps.event.addListener(
            marker,
            'mouseout',
            hideInfoWindow,
          );
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

      let allResults: SearchResult[] = [];

      const handleSearch = (
        data: SearchResult[],
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
            setSearchResult(allResults);
            updateMarkers(
              allResults,
              item => item.y,
              item => item.x,
            );
            mapRef.current.setCenter(
              new window.kakao.maps.LatLng(allResults[0].y, allResults[0].x),
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

    // 길찾기 API 요청
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const getWalkingRoute = async (
      originX: number,
      originY: number,
      destX: number,
      destY: number,
    ) => {
      const url = `https://apis-navi.kakaomobility.com/v1/walking?origin=${originX},${originY}&destination=${destX},${destY}`;
      const headers = {
        Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
      };

      const response = await fetch(url, { headers });
      const data = await response.json();

      if (data?.routes?.length) {
        const { duration, distance } = data.routes[0].summary;
        return { duration, distance };
      }

      return null;
    };

    if (pathname === '/cafe') {
      removeMarkers();
      removeInfoWindows();
    }

    if (pathname === '/cafe/search') {
      const query = keyword.includes('카페') ? keyword : `${keyword} 카페`;
      searchCafes(query);
    }

    if (pathname.startsWith('/cafe/search/detail')) {
      updateMarkers(
        searchResult,
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
      pathname.startsWith('/cafe/search/detail') ||
      pathname.startsWith('/cafe/collected/detail') ||
      pathname.startsWith('/cafe/bookmarked/detail')
    ) {
      mapRef.current.setCenter(new window.kakao.maps.LatLng(thisY, thisX));
    }
  }, [
    mapLoaded,
    keyword,
    thisX,
    thisY,
    pathname,
    setSearchResult,
    searchResult,
    bookmarkedCafe,
    collectedCafe,
  ]);

  return (
    <article
      aria-label="kakao map"
      id="map"
      className={KakaoMapStyle}
    ></article>
  );
}
