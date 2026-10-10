/**
 * 한국 시간 기준 연·월·일 포맷터
 * @description created_at은 UTC로 저장되므로 시간대를 고정하지 않으면
 * 오전 9시 전에 수집한 카드가 전날로 찍히고, 서버(UTC)와 브라우저(KST)가
 * 다른 날짜를 렌더링해 hydration이 어긋납니다. 생성 비용이 있어 한 번만 만듭니다.
 */
const KST_DATE_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * 카드를 획득한 날짜를 2026.10.10 형식으로 반환합니다
 * @param isoDate ISO 8601 날짜 문자열 (예: collection.created_at)
 */
export const formatCollectedDate = (isoDate: string): string => {
  const parts = KST_DATE_FORMATTER.formatToParts(new Date(isoDate));
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find(part => part.type === type)?.value ?? '';

  return `${pick('year')}.${pick('month')}.${pick('day')}`;
};
