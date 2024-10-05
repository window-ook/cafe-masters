'use client';

import { useEffect } from 'react';
import { useMapStore } from 'utils/store';

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap: React.FC = () => {
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
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options); // 지도
        const ps = new window.kakao.maps.services.Places(); // 장소
        const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 }); // 정보창
        // 마커
        const marker = new window.kakao.maps.Marker({
          position: map.getCenter(),
        });
        marker.setMap(map);

        const zoomControl = new window.kakao.maps.ZoomControl(); // 줌 기능
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
        // map.setDraggable(true);
        // map.setZoomable(true);

        // 검색으로 장소 검색
        const searchPlaces = (query: string) => {
          ps.keywordSearch(query, (data: any, status: any, pagination: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
              setResults(data);
              const place = data[0];
              const latlng = new window.kakao.maps.LatLng(place.y, place.x);

              map.panTo(latlng);
              marker.setPosition(latlng);

              infowindow.setContent(
                `<div style="padding:5px;">${place.place_name}</div>`
              );
              infowindow.open(map, marker);
            } else {
              alert('검색 결과가 없습니다.');
            }
          });
        };

        searchPlaces(keyword);

        window.kakao.maps.event.addListener(
          map,
          'click',
          function (mouseEvent: any) {
            const latlng = mouseEvent.latLng;
            map.panTo(latlng);
            marker.setPosition(latlng);
          }
        );
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
        left: 0,
        zIndex: 0,
      }}
    />
  );
};

export default KakaoMap;
