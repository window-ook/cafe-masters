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
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 4,
        };
        const map = new window.kakao.maps.Map(container, options);
        const geocoder = new window.kakao.maps.services.Geocoder();
        const ps = new window.kakao.maps.services.Places();
        const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        let markers: any[] = [];

        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

        // 마커 표시
        const displayMarkers = (place: any) => {
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(place.y, place.x),
          });
          markers.push(marker);

          window.kakao.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(
              `<div style="padding:5px;">${place.place_name}</div>`
            );
            infowindow.open(map, marker); // 마커 클릭시 정보창 표시
          });
        };

        const removeMarkers = () => {
          markers.forEach((marker) => marker.setMap(null));
          markers = [];
        };

        // 키워드로 카페 검색
        const searchByKeyword = (query) => {
          ps.keywordSearch(query, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(data[0].y, data[0].x);
              map.setCenter(coords); // 중앙 좌표 설정
              setResults(data);
              console.log(data);
              removeMarkers();
              data.forEach((place) => displayMarkers(place));
            } else {
              alert('검색 결과가 없습니다.');
            }
          });
        };

        const handleSearch = (query) => {
          if (query.includes('카페')) searchByKeyword(query);
          else searchByKeyword(`${query} 카페`);
        };

        if (
          window.location.pathname === '/cafe/all' ||
          window.location.pathname === '/'
        ) {
          if (keyword) handleSearch(keyword);
          else alert('검색어를 입력해주세요.');
        }
      });
    };

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
