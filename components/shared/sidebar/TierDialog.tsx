'use client';

import { IBadge } from '@/types/shared/tier';
import { useUIStore } from '@/stores';
import {
  getExpertTierStyle,
  getMasterTierStyle,
  masterTierModalStyle,
} from 'utils/styles';

interface ITierDialog {
  open: boolean;
  handleCloseAction: () => void;
}

const Badge = ({ tier, range, color }: IBadge) => {
  return (
    <div className="flex items-center gap-3">
      <p className={color}>
        <span className="text-sm font-dpixel">{tier}</span>
      </p>
      <p className="text-xl font-bold font-pretendard">{range}</p>
    </div>
  );
};

const TIER_DESC_STYLE = 'font-pretendard font-bold text-gray-500 lg:text-lg text-xs';
const BADGE_STYLE = 'rounded-xl w-20 h-6 py-4 flex items-center justify-center';

export default function TierDialog({
  open,
  handleCloseAction,
}: ITierDialog) {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);

  return (
    <article>
      {open && (
        <button type="button" onClick={handleCloseAction}>
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm text-left"
            onClick={handleCloseAction}
          >
            <div
              className={`${isDarkTheme ? 'bg-main-dark text-white border-main-dark-border border-4' : 'bg-white border-main-shadow border-4'} absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] sm:w-[30%] md:w-[50%] w-[80%] h-[70%] shadow-md p-4 flex flex-col gap-4 justify-center`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col">
                <p className="font-pretendard font-extrabold text-2xl md:text-3xl">
                  TIER INFORMATION
                </p>
                <p className={TIER_DESC_STYLE}>
                  수집한 카드의 개수에 따라 티어가 부여됩니다
                </p>
              </div>
              <Badge
                tier={'BEGINNER'}
                range={'0 ~ 9'}
                color={`bg-beginner text-white ${BADGE_STYLE}`}
              />
              <p className={TIER_DESC_STYLE}>
                당신은 카페 월드의 초보! 갈 길이 멉니다ㅜㅜ
              </p>
              <Badge
                tier={'JUNIOR'}
                range={'10 ~ 19'}
                color={`bg-junior text-white ${BADGE_STYLE}`}
              />
              <p className={TIER_DESC_STYLE}>
                열심히 카페를 다니고 있는 주니어에요
              </p>
              <Badge
                tier={'SENIOR'}
                range={'20 ~ 29'}
                color={`bg-senior text-white ${BADGE_STYLE}`}
              />
              <p className={TIER_DESC_STYLE}>
                커피 좀 마셔봤다는 시니어가 되셨네요 후훗
              </p>
              <Badge
                tier={'EXPERT'}
                range={'30 ~ 39'}
                color={getExpertTierStyle(BADGE_STYLE)}
              />
              <p className={TIER_DESC_STYLE}>
                어엿한 카페 고수입니다 뿌듯하셔도 좋아요!!
              </p>
              <div className="relative flex items-center gap-3">
                <div className={masterTierModalStyle}></div>
                <p className={getMasterTierStyle(BADGE_STYLE)}>
                  <span className="text-sm font-dpixel">MASTER</span>
                </p>
                <p className="z-10 relative text-xl font-bold font-pretendard">
                  40
                </p>
              </div>
              <p className={TIER_DESC_STYLE}>
                마스터여, 당신은 월드의 주인입니다
              </p>
            </div>
          </div>
        </button>
      )}
    </article>
  );
}
