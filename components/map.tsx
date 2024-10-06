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
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        const geocoder = new window.kakao.maps.services.Geocoder();
        const ps = new window.kakao.maps.services.Places();
        const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        let markers: any[] = [];

        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

        const handleClickOnMap = (mouseEvent: any) => {
          const latlng = mouseEvent.latLng;
          map.panTo(latlng);
        };

        const displayMarker = (place: any) => {
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(place.y, place.x),
          });
          markers.push(marker);

          window.kakao.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(
              `<div style="padding:5px;">${place.place_name}</div>`
            );
            infowindow.open(map, marker);
          });
        };

        const removeMarkers = () => {
          markers.forEach((marker) => marker.setMap(null));
          markers = [];
        };

        const searchPlacesByKeyword = (query: string) => {
          const addressQuery = query.replace('카페', '').trim();

          geocoder.addressSearch(
            addressQuery,
            function (result: any, status: any) {
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(
                  result[0].y,
                  result[0].x
                );
                map.setCenter(coords);

                const searchCallback = (data: any, status: any) => {
                  if (status === window.kakao.maps.services.Status.OK) {
                    setResults(data);
                    removeMarkers();
                    data.forEach((place: any) => displayMarker(place));
                  } else {
                    alert('검색 결과가 없습니다.');
                  }
                };

                ps.keywordSearch('카페', searchCallback, {
                  location: coords,
                  radius: 5000,
                });
              } else {
                alert('주소를 찾을 수 없습니다.');
              }
            }
          );
        };

        if (window.location.pathname === '/cafe/all') {
          if (keyword) searchPlacesByKeyword(keyword);
          else alert('검색어를 입력해주세요.');
        }

        window.kakao.maps.event.addListener(map, 'click', handleClickOnMap);
      });
    };

    return () => {
      script.remove();
    };
  }, [keyword, setResults]);

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
