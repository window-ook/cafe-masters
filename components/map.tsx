'use client';

import { useEffect } from 'react';
import { useMapStore } from 'utils/store';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap() {
  const keyword = useMapStore((state) => state.keyword);
  const setResults = useMapStore((state) => state.setResults);

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
        const geocoder = new window.kakao.maps.services.Geocoder(); // 주소 -> 좌표 변환
        const ps = new window.kakao.maps.services.Places();
        const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        let markers: any[] = [];

        const displayMarkers = (place: any) => {
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(place.y, place.x),
          });
          markers.push(marker);

          window.kakao.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(
              `<div style="padding:15px;">${place.place_name}</div>`
            );
            infowindow.open(map, marker);
          });
        };

        const removeMarkers = () => {
          markers.forEach((marker) => marker.setMap(null));
          markers = [];
        };

        const searchByKeyword = (query) => {
          ps.keywordSearch(query, (data, status, pagination) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(data[0].y, data[0].x);
              map.setCenter(coords);

              const filtered_data = data.filter(
                (item: any) => item['category_group_code'] === 'CE7'
              );

              const results = [...filtered_data]; // CE7 카페에 해당하는 장소만 결과로

              const handlePagination = (newData, status, newPagination) => {
                if (status === window.kakao.maps.services.Status.OK) {
                  const moreFilteredData = newData.filter(
                    (item) => item['category_group_code'] === 'CE7'
                  );
                  results.push(...moreFilteredData);

                  if (newPagination.hasNextPage && results.length < 45)
                    newPagination.nextPage();
                  else {
                    setResults(results);
                    removeMarkers();
                    results.forEach((place) => displayMarkers(place));
                  }
                }
              };

              // 첫 번째 페이지 처리
              if (pagination.hasNextPage && results.length < 45) {
                pagination.nextPage();
                ps.keywordSearch(query, handlePagination, pagination);
              } else {
                setResults(results);
                removeMarkers();
                results.forEach((place) => displayMarkers(place));
              }
            } else {
              alert('검색 결과가 없습니다.');
            }
          });
        };

        if (
          window.location.pathname === '/' ||
          window.location.pathname === '/cafe/all'
        ) {
          if (keyword.includes('카페')) searchByKeyword(keyword);
          else searchByKeyword(`${keyword} 카페`);
        }
      });
    };

    // 수집한 카페 버튼을 누르면 수파베이스에서 데이터를 받아오고, 사이드바에서 카페를 클릭하면 맵에 마커로 표시하고 중앙으로 옮겨주는 로직 추가

    return () => {
      script.remove();
    };
  }, [keyword]);

  return (
    <div
      id="map"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 320,
        zIndex: 0,
      }}
    />
  );
}
