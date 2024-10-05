'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
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

        const marker = new window.kakao.maps.Marker({
          position: map.getCenter(),
        });
        marker.setMap(map);

        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
        map.setDraggable(true);
        map.setZoomable(true);

        window.kakao.maps.event.addListener(
          map,
          'click',
          function (mouseEvent: any) {
            const latlng = mouseEvent.latLng;

            marker.setPosition(latlng);

            const resultDiv = document.getElementById('clickLatlng');
            if (resultDiv) {
              resultDiv.innerHTML =
                '클릭한 위치의 위도는 ' +
                latlng.getLat() +
                '이고, 경도는 ' +
                latlng.getLng() +
                '입니다';
            }
          }
        );
      });
    };

    return () => {
      script.remove();
    };
  }, []);

  return (
    <>
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
      <div
        id="clickLatlng"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 1,
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        클릭한 위치의 정보가 여기에 표시됩니다.
      </div>
    </>
  );
};

export default KakaoMap;
