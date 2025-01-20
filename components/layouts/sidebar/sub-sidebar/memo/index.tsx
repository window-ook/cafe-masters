import { usePathname } from 'next/navigation';
import {
  getMemoBackStyle,
  getMemoInputStyle,
  getMemoSubmitStyle,
} from 'utils/styles';
import { MemoProps } from 'types/common';
import { Rating } from '@mui/material';

export default function Memo({
  detailName,
  collectedCafeDetailName,
  bookmarkedCafeDetailName,
  comment,
  pros,
  cons,
  eaten,
  concept,
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
        <span className="font-dpixel text-2xl font-semibold">
          {pathname.startsWith('/cafe/all') && detailName}
          {pathname.startsWith('/cafe/collected') && collectedCafeDetailName}
          {pathname.startsWith('/cafe/bookmarked') && bookmarkedCafeDetailName}
        </span>
        <button
          aria-label="카드 수집 취소 버튼"
          onClick={() => setMemoOpen(false)}
          className={getMemoBackStyle(isDarkTheme)}
        >
          <span>Back</span>
        </button>
      </div>
      <input
        required
        value={comment}
        placeholder="코멘트(필수)"
        onChange={e => setComment(e.target.value)}
        className={getMemoInputStyle(isDarkTheme)}
      />
      <input
        value={pros}
        placeholder="좋은 점"
        onChange={e => setPros(e.target.value)}
        className={getMemoInputStyle(isDarkTheme)}
      />
      <input
        placeholder="별로인 점"
        value={cons}
        onChange={e => setCons(e.target.value)}
        className={getMemoInputStyle(isDarkTheme)}
      />
      <input
        required
        value={eaten}
        placeholder="먹은 메뉴(필수)"
        onChange={e => setEaten(e.target.value)}
        className={getMemoInputStyle(isDarkTheme)}
      />
      <input
        placeholder="카페 컨셉"
        value={concept}
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
