'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useMapStore } from 'utils/store';
import {
  AllCafe,
  CollectedCafeDetailForUpload,
  NormalCafeDetailForUpload,
} from 'types/common';
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
          clickable: true,
        };
        const map = new window.kakao.maps.Map(container, options);
        const ps = new window.kakao.maps.services.Places();
        const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
        const zoomControl = new window.kakao.maps.ZoomControl();
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
        let markers: any[] = [];

        // 검색 결과 마커 표시
        const displayResults = (cafe: AllCafe) => {
          if (!cafe.x || !cafe.y) return;

          const latlng = new window.kakao.maps.LatLng(cafe.y, cafe.x);
          map.setCenter(latlng);

          const marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(cafe.y, cafe.x),
          });
          markers.push(marker);

          if (window.innerWidth > 768) {
            window.kakao.maps.event.addListener(
              marker,
              'mouseover',
              function () {
                infowindow.setContent(
                  `<div style="padding: 1rem 2rem 1rem 2rem; font-size:1rem; white-space:nowrap">${cafe.place_name}</div>`,
                );
                infowindow.open(map, marker);
              },
            );

            window.kakao.maps.event.addListener(
              marker,
              'mouseout',
              function () {
                infowindow.close();
              },
            );
          } else {
            window.kakao.maps.event.addListener(marker, 'click', function () {
              infowindow.setContent(
                `<div style="padding: 1rem 2rem 1rem 2rem; font-size:1rem; white-space:nowrap">${cafe.place_name}</div>`,
              );
              infowindow.open(map, marker);
            });

            window.kakao.maps.event.addListener(map, 'click', function () {
              infowindow.close();
            });
          }
        };

        // 수집한 카드 마커 표시
        const displayCollected = (cafe: CollectedCafeDetailForUpload) => {
          if (!cafe.coordX || !cafe.coordY) return;

          const latlng = new window.kakao.maps.LatLng(cafe.coordY, cafe.coordX);
          map.setCenter(latlng);

          const marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(cafe.coordY, cafe.coordX),
          });
          markers.push(marker);

          if (window.innerWidth > 768) {
            window.kakao.maps.event.addListener(
              marker,
              'mouseover',
              function () {
                infowindow.setContent(
                  `<div style="padding: 1rem 2rem 1rem 2rem; font-size:1rem; white-space:nowrap">${cafe.name}</div>`,
                );
                infowindow.open(map, marker);
              },
            );

            window.kakao.maps.event.addListener(
              marker,
              'mouseout',
              function () {
                infowindow.close();
              },
            );
          } else {
            window.kakao.maps.event.addListener(marker, 'click', function () {
              infowindow.setContent(
                `<div style="padding: 1rem 2rem 1rem 2rem; font-size:1rem; white-space:nowrap">${cafe.name}</div>`,
              );
              infowindow.open(map, marker);
            });

            window.kakao.maps.event.addListener(map, 'click', function () {
              infowindow.close();
            });
          }
        };

        // 북마크 카페 마커 표시
        const displayBookmarked = (cafe: NormalCafeDetailForUpload) => {
          if (!cafe.coordX || !cafe.coordY) return;

          const latlng = new window.kakao.maps.LatLng(cafe.coordY, cafe.coordX);
          map.setCenter(latlng);

          const marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(cafe.coordY, cafe.coordX),
          });
          markers.push(marker);

          if (window.innerWidth > 768) {
            window.kakao.maps.event.addListener(
              marker,
              'mouseover',
              function () {
                infowindow.setContent(
                  `<div style="padding: 1rem 2rem 1rem 2rem; font-size:1rem; white-space:nowrap">${cafe.name}</div>`,
                );
                infowindow.open(map, marker);
              },
            );

            window.kakao.maps.event.addListener(
              marker,
              'mouseout',
              function () {
                infowindow.close();
              },
            );
          } else {
            window.kakao.maps.event.addListener(marker, 'click', function () {
              infowindow.setContent(
                `<div style="padding: 1rem 2rem 1rem 2rem; font-size:1rem; white-space:nowrap">${cafe.name}</div>`,
              );
              infowindow.open(map, marker);
            });

            window.kakao.maps.event.addListener(map, 'click', function () {
              infowindow.close();
            });
          }
        };

        // 선택한 카페의 마커를 맵의 센터에 표시
        const displayDetailCenter = (x: number, y: number) => {
          const latlng = new window.kakao.maps.LatLng(y, x);
          map.setCenter(latlng);
        };

        // 마커 삭제
        const removeMarkers = () => {
          markers.forEach(marker => marker.setMap(null));
          markers = [];
        };

        // 카페 검색하기
        const searchResults = (query: string) => {
          ps.keywordSearch(
            query,
            (data: AllCafe[], status: string, pagination: KakaoPagination) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(
                  data[0].y,
                  data[0].x,
                );
                map.setCenter(coords);

                const filtered_data = data.filter(
                  (item: AllCafe) => item['category_group_code'] === 'CE7',
                );

                const results = [...filtered_data];

                const handlePagination = (
                  newData: AllCafe[],
                  status: string,
                  newPagination: KakaoPagination,
                ) => {
                  if (status === window.kakao.maps.services.Status.OK) {
                    const moreFilteredData = newData.filter(
                      (item: AllCafe) => item['category_group_code'] === 'CE7',
                    );
                    results.push(...moreFilteredData);

                    if (newPagination.hasNextPage && results.length < 45)
                      newPagination.nextPage();
                    else {
                      setAllCafe(results);
                      removeMarkers();
                      results.forEach(cafe => displayResults(cafe));
                    }
                  }
                };

                if (pagination.hasNextPage && results.length < 45) {
                  pagination.nextPage();
                  ps.keywordSearch(query, handlePagination, pagination);
                } else {
                  setAllCafe(results);
                  removeMarkers();
                  results.forEach(cafe => displayResults(cafe));
                }
              } else {
                toast.warning(
                  `${query.replace('카페', '').trim()}의 검색 결과가 없습니다`,
                );
                const defaultLatLng = new window.kakao.maps.LatLng(
                  37.54715716085294,
                  127.04663357436208,
                );
                map.setCenter(defaultLatLng);
              }
            },
          );
        };

        if (pathname === '/' || pathname.startsWith('/cafe/all/detail')) {
          removeMarkers();
          allCafe.forEach((cafe: AllCafe) => displayResults(cafe));
        }

        if (pathname === '/cafe/all') {
          if (keyword.includes('카페')) searchResults(keyword);
          else searchResults(`${keyword} 카페`);
        }

        if (pathname.startsWith('/cafe/collected')) {
          removeMarkers();
          if (collectedCafe && collectedCafe.length > 0) {
            collectedCafe.forEach((cafe: CollectedCafeDetailForUpload) =>
              displayCollected(cafe),
            );
          } else {
            const defaultLatLng = new window.kakao.maps.LatLng(
              37.54715716085294,
              127.04663357436208,
            );
            map.setCenter(defaultLatLng);
          }
        }

        if (pathname.startsWith('/cafe/bookmarked')) {
          removeMarkers();
          if (bookmarkedCafe && bookmarkedCafe.length > 0) {
            bookmarkedCafe.forEach((cafe: NormalCafeDetailForUpload) =>
              displayBookmarked(cafe),
            );
          } else {
            const defaultLatLng = new window.kakao.maps.LatLng(
              37.54715716085294,
              127.04663357436208,
            );
            map.setCenter(defaultLatLng);
          }
        }

        if (
          pathname.startsWith('/cafe/all/detail') ||
          pathname.startsWith('/cafe/collected/detail') ||
          pathname.startsWith('/cafe/bookmarked/detail')
        ) {
          displayDetailCenter(thisX, thisY);
        }

        if (pathname.startsWith('/resetpassword')) return null;
      });
    };

    return () => {
      script.remove();
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [keyword, pathname]);

  if (pathname.startsWith('/resetpassword')) return null;

  return <div id="map" className={KakaoMapStyle} />;
}
