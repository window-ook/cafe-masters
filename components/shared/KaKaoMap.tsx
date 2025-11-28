'use client';

import { useEffect, useRef, useState } from 'react';
import { useCafeClick } from '@/hooks/ui/useCafeClick';
import { usePathMatcher } from '@/hooks/ui/usePathMatcher';
import { useCollectionCafes } from '@/hooks/supabase/collection';
import { useBookmarkCafes } from '@/hooks/supabase/bookmark';
import { useRecommendationCafes } from '@/hooks/supabase/recommendation/useRecommendationCafes';
import { useCurrentCafeStore, useSearchedResultStore, useFilterStore, useUserStore } from '@/stores';
import { IKakaoSearchResult } from '@/types/kakao-map';
import { EXTERNAL_PATHS, IMAGE_PATHS } from '@/lib/paths';
import { toast } from 'react-toastify';

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
  const paths = usePathMatcher();

  const userId = useUserStore(state => state.userId);
  const keyword = useFilterStore(state => state.keyword);
  const searchResult = useSearchedResultStore(state => state.searchResult);
  const setSearchResult = useSearchedResultStore(state => state.setSearchResult);
  const currentCoordX = useCurrentCafeStore(state => state.currentCoordX);
  const currentCoordY = useCurrentCafeStore(state => state.currentCoordY);

  const { filteredCollectionCafes } = useCollectionCafes(userId);
  const { filteredBookmarkCafes } = useBookmarkCafes(userId);
  const { recommendationCafes, isPending: isRecommendedCafesLoading } = useRecommendationCafes();

  // 페이지별 카페 클릭 핸들러 설정
  const getRoutePathForCurrentPage = () => {
    if (paths.isSearch) return 'search';
    if (paths.isCollection) return 'collection';
    if (paths.isBookmark) return 'bookmark';
    if (paths.isRecommendation) return 'recommendation';
    return 'search';
  };

  const handleCafeClick = useCafeClick({ routePath: getRoutePathForCurrentPage() });

  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  const mapRef = useRef<any | null>(null);
  const openInfoWindowRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const prevMarkerDataRef = useRef<any[] | null>(null);
  const prevKeywordRef = useRef<string | null>(null);

  useEffect(() => {
    const existingScript = document.querySelector(`script[src*="dapi.kakao.com"]`);

    if (existingScript) {
      if (window.kakao?.maps) {
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
      }
      return;
    }

    const script = document.createElement('script');
    script.src = EXTERNAL_PATHS.KAKAO_MAP;
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
      if (!document.querySelector(`script[src*="dapi.kakao.com"]`)) return;
      script.remove();
    };
  }, []);

  // 인포윈도우 제거
  const removeInfoWindows = () => {
    if (openInfoWindowRef.current) {
      openInfoWindowRef.current.setMap(null);
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
        const imageSrc = IMAGE_PATHS.CUSTOM_MARKER_1;

        const normalSize = new window.kakao.maps.Size(54, 54);
        const normalOffset = new window.kakao.maps.Point(27, 54);

        const normalMarkerImage = new window.kakao.maps.MarkerImage(imageSrc, normalSize, { offset: normalOffset });

        const marker = new window.kakao.maps.Marker({ map, position, image: normalMarkerImage });

        const createInfoWindows = () => {
          const cafeName = item.place_name || item.name;
          const overlayContent = `
            <div class="marker-infowindow">
              <div class="title">${cafeName}</div>
            </div>
          `;

          const overlay = new window.kakao.maps.CustomOverlay({
            content: overlayContent,
            map: map,
            position: position,
            zIndex: 2000
          });

          openInfoWindowRef.current = overlay;
        };

        const showInfoWindow = () => {
          removeInfoWindows();
          createInfoWindows();
        };

        const hideInfoWindow = () => {
          if (openInfoWindowRef.current) openInfoWindowRef.current.setMap(null);
        };

        const handleMarkerMouseOver = () => {
          marker.setZIndex(1000);
          if (window.innerWidth > 768) showInfoWindow();
        };

        const handleMarkerMouseOut = () => {
          marker.setImage(normalMarkerImage);
          marker.setZIndex(1);
          if (window.innerWidth > 768) hideInfoWindow();
        };

        const handleMarkerClick = () => {
          // 카페 데이터 형태에 맞게 변환
          const cafeData = {
            id: item.id || item.place_id,
            place_name: item.place_name || item.name,
            coordX: item.x || item.coordX,
            coordY: item.y || item.coordY,
            x: item.x || item.coordX,
            y: item.y || item.coordY,
          };
          handleCafeClick(cafeData);
        };

        // 마커 클릭 이벤트는 항상 추가
        window.kakao.maps.event.addListener(marker, 'click', handleMarkerClick);

        if (window.innerWidth > 768) {
          window.kakao.maps.event.addListener(marker, 'mouseover', handleMarkerMouseOver);
          window.kakao.maps.event.addListener(marker, 'mouseout', handleMarkerMouseOut);
        } else window.kakao.maps.event.addListener(map, 'click', hideInfoWindow);

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
        } else toast.warning(`${query.replace('카페', '').trim()}의 검색 결과가 없습니다`);
      };

      ps.keywordSearch(query, handleSearch);
    };

    if (paths.isSearch && !paths.isSearchDetail) {
      const query = keyword.includes('카페') ? keyword : `${keyword} 카페`;
      searchCafes(query);
    }

    if (paths.isSearchDetail) {
      updateMarkers(
        searchResult,
        cafe => cafe.y,
        cafe => cafe.x,
      );
    }

    if (paths.isCollection && !paths.isCollectionDetail) {
      updateMarkers(
        filteredCollectionCafes,
        cafe => cafe.coordY,
        cafe => cafe.coordX,
      );
    }

    if (paths.isBookmark && !paths.isBookmarkDetail) {
      updateMarkers(
        filteredBookmarkCafes,
        cafe => cafe.coordY,
        cafe => cafe.coordX,
      );
    }

    if (paths.isRecommendation && !paths.isRecommendationDetail) {
      if (!isRecommendedCafesLoading && recommendationCafes) {
        updateMarkers(
          recommendationCafes,
          cafe => cafe.coordY,
          cafe => cafe.coordX,
        );
      }
    }

    if (
      paths.isSearchDetail ||
      paths.isCollectionDetail ||
      paths.isBookmarkDetail ||
      paths.isRecommendationDetail
    ) {
      mapRef.current.setCenter(new window.kakao.maps.LatLng(currentCoordY, currentCoordX));
    }
  }, [
    handleCafeClick,
    mapLoaded,
    keyword,
    currentCoordX,
    currentCoordY,
    paths,
    setSearchResult,
    searchResult,
    filteredBookmarkCafes,
    filteredCollectionCafes,
    recommendationCafes,
    isRecommendedCafesLoading,
  ]);

  return (
    <figure
      id="map"
      aria-label="kakao map"
      className="fixed z-0 top-0 w-screen h-screen sm:translate-x-108 sm:w-[calc(100vw-27rem)]"
    />
  );
}