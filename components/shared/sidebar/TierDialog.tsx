'use client';

import React, { useEffect, useRef } from 'react';
import { IBadge } from '@/types/shared/tier';
import { useUIStore } from '@/stores';
interface ITierDialog {
  isOpen: boolean;
  handleDialogCloseAction: () => void;
}

const Badge = ({ tier, range, color }: IBadge) => {
  return (
    <div className="flex items-center gap-5">
      <p className={color}>
        <span className="text-sm font-dunggeunmo">{tier}</span>
      </p>
      <p className="text-xl font-bold">{range}</p>
    </div>
  );
};

const TIER_DESC_STYLE = 'font-semibold text-gray-500 lg:text-lg text-xs';
const BADGE_STYLE = 'rounded-xl w-20 h-6 py-4 flex items-center justify-center';

export default function TierDialog({
  isOpen,
  handleDialogCloseAction,
}: ITierDialog) {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) dialog.showModal();
    else dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby='티어 정보 다이얼로그'
      onClose={handleDialogCloseAction}
      className='fixed inset-0 z-50 backdrop:bg-black/50 backdrop:backdrop-blur-sm m-0 p-0 max-w-none max-h-none w-full h-full bg-transparent border-none'
    >
      <div
        className="flex items-center justify-center w-full h-full p-4"
        onClick={handleDialogCloseAction}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`${isDarkTheme ? 'bg-dark-background text-white border-dark-border border-4' : 'bg-white border-main-shadow border-4'} relative sm:w-[30%] md:w-[50%] w-[80%] h-[70%] shadow-md p-4 flex flex-col gap-4 justify-center rounded-lg max-h-[90vh] overflow-y-auto`}
        >
          <div className="flex items-end gap-2">
            <p className="font-extrabold text-2xl md:text-3xl">
              TIER INFORMATION
            </p>
            <p className='font-medium'>
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
            color={`${BADGE_STYLE} bg-linear-to-r from-expert-side via-expert-via to-expert-side bg-size-[200%_200%] animate-gradient text-black shadow-md shadow-amber-700`}
          />
          <p className={TIER_DESC_STYLE}>
            어엿한 카페 고수입니다 뿌듯하셔도 좋아요!!
          </p>
          <div className="relative flex items-center gap-5">
            <div className='master-dialog-badge'></div>
            <p className={`${BADGE_STYLE} z-10 relative bg-linear-to-r from-master-side via-master-via to-master-side bg-size-[200%_200%] animate-gradient text-white shadow-md`}>
              <span className="text-sm font-dunggeunmo">MASTER</span>
            </p>
            <p className="z-10 relative text-xl font-bold">
              40+
            </p>
          </div>
          <p className={TIER_DESC_STYLE}>
            마스터여, 당신은 월드의 주인입니다
          </p>
        </div>
      </div>
    </dialog>
  );
}
