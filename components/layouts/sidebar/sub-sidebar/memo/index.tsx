import { usePathname } from 'next/navigation';
import {
  getMemoBackStyle,
  getMemoInputStyle,
  getMemoSubmitStyle,
} from 'utils/styles';
import { MemoProps } from 'types/common';
import { Rating } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';

export default function Memo({
  detail,
  collectedCafeDetail,
  bookmarkedCafeDetail,
  setComment,
  setPros,
  setCons,
  setEaten,
  setConcept,
  isDarkTheme,
  setMemoOpen,
  setRating,
  rating,
}: MemoProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col p-2 gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {pathname.startsWith('/cafe/all') && detail.name}
          {pathname.startsWith('/cafe/collected') && collectedCafeDetail?.name}
          {pathname.startsWith('/cafe/bookmarked') &&
            bookmarkedCafeDetail?.name}
        </h2>
        <button
          aria-label="카드 수집 취소 버튼"
          onClick={() => setMemoOpen(false)}
          className={getMemoBackStyle(isDarkTheme)}
        >
          <FontAwesomeIcon icon={faRotateLeft} />
        </button>
      </div>
      <input
        required
        placeholder="내 코멘트(필수)"
        onChange={e => setComment(e.target.value)}
        className={getMemoInputStyle(isDarkTheme)}
      />
      <input
        placeholder="좋은 점"
        onChange={e => setPros(e.target.value)}
        className={getMemoInputStyle(isDarkTheme)}
      />
      <input
        placeholder="별로인 점"
        onChange={e => setCons(e.target.value)}
        className={getMemoInputStyle(isDarkTheme)}
      />
      <input
        required
        placeholder="먹어본 메뉴(필수)"
        onChange={e => setEaten(e.target.value)}
        className={getMemoInputStyle(isDarkTheme)}
      />
      <input
        placeholder="카페의 컨셉"
        onChange={e => setConcept(e.target.value)}
        className={getMemoInputStyle(isDarkTheme)}
      />
      <div className="flex items-center gap-2">
        <span>별점 매기기</span>
        <Rating
          name="simple-controlled"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue ?? 5);
          }}
        />
      </div>
      <button
        aria-label="카드 수집 완료 버튼"
        type="submit"
        className={getMemoSubmitStyle(isDarkTheme)}
      >
        <span className="text-lg">완료</span>
      </button>
    </div>
  );
}
