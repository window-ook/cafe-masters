'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useMapStore } from 'utils/store';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap() {
  const pathname = usePathname();
  const keyword = useMapStore((state) => state.keyword);
  const setAllCafe = useMapStore((state) => state.setAllCafe);
  const allCafe = useMapStore((state) => state.allCafe);
  const collectedCafe = useMapStore((state) => state.collectedCafe);
  const bookmarkedCafe = useMapStore((state) => state.bookmarkedCafe);

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
            127.04663357436208,
            37.54715716085294
          ),
          level: 5,
        };
        const map = new window.kakao.maps.Map(container, options);
        const ps = new window.kakao.maps.services.Places();
        const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        let markers: any[] = [];

        // 검색 결과 = cafeAll의 마커 표시
        const displayResults = (place) => {
          if (!place.x || !place.y) return;

          // 지도에 표시하고 센터로 위치시키기
          const latlng = new window.kakao.maps.LatLng(place.y, place.x);
          map.setCenter(latlng);

          const marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(place.y, place.x),
          });
          markers.push(marker);

          window.kakao.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(
              `<div style="padding: 1rem 2rem 1rem 2rem; font-size:1rem; white-space:nowrap">${place.place_name}</div>`
            );
            infowindow.open(map, marker);
          });
        };

        // 수집한 카드, 북마크 카페의 마커 표시
        const displayCollected = (place) => {
          if (!place.coordX || !place.coordY) return;

          // 지도에 표시하고 센터로 위치시키기
          const latlng = new window.kakao.maps.LatLng(
            place.coordY,
            place.coordX
          );
          map.setCenter(latlng);

          const marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(place.coordY, place.coordX),
          });
          markers.push(marker);

          window.kakao.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(
              `<div style="padding: 1rem 2rem 1rem 2rem; font-size:1rem; white-space:nowrap">${place.name}</div>`
            );
            infowindow.open(map, marker);
          });
        };

        const removeMarkers = () => {
          markers.forEach((marker) => marker.setMap(null));
          markers = [];
        };

        const searchResults = (query) => {
          ps.keywordSearch(query, (data, status, pagination) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(data[0].y, data[0].x);
              map.setCenter(coords);

              const filtered_data = data.filter(
                (item: any) => item['category_group_code'] === 'CE7'
              );

              const results = [...filtered_data];

              const handlePagination = (newData, status, newPagination) => {
                if (status === window.kakao.maps.services.Status.OK) {
                  const moreFilteredData = newData.filter(
                    (item) => item['category_group_code'] === 'CE7'
                  );
                  results.push(...moreFilteredData);

                  if (newPagination.hasNextPage && results.length < 45)
                    newPagination.nextPage();
                  else {
                    setAllCafe(results);
                    console.log(results);
                    removeMarkers();
                    results.forEach((place) => displayResults(place));
                  }
                }
              };

              if (pagination.hasNextPage && results.length < 45) {
                pagination.nextPage();
                ps.keywordSearch(query, handlePagination, pagination);
              } else {
                setAllCafe(results);
                removeMarkers();
                results.forEach((place) => displayResults(place));
              }
            } else {
              alert(`${query}의 결과가 없습니다.`);
            }
          });
        };

        if (pathname === '/cafe/all') {
          if (keyword.includes('카페')) searchResults(keyword);
          else searchResults(`${keyword} 카페`);
        }

        if (pathname === '/' || pathname.startsWith('/cafe/all/detail')) {
          removeMarkers();
          allCafe.forEach((cafe) => displayResults(cafe));
        }

        if (pathname.startsWith('/cafe/collected')) {
          removeMarkers();
          collectedCafe.forEach((cafe) => displayCollected(cafe));
        }

        if (pathname.startsWith('/cafe/bookmarked')) {
          removeMarkers();
          bookmarkedCafe.forEach((cafe) => displayCollected(cafe));
        }
      });
    };

    return () => {
      script.remove();
    };
  }, [keyword, pathname]);

  return (
    <div
      id="map"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 348,
        zIndex: 0,
      }}
    />
  );
}
