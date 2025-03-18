import { useCheckStore } from 'utils/store';
import { BadgeProps } from 'types/common';
import {
  BadgeCommon,
  getExpertTierStyle,
  getMasterTierStyle,
  ModalMasterEffectStyle,
} from 'utils/styles';
import { Box, Modal } from '@mui/material';

interface TierInfoModalProps {
  open: boolean;
  handleClose: () => void;
}

function Badge({ tier, range, color }: BadgeProps) {
  return (
    <div className="flex items-center gap-3">
      <p className={color}>
        <span className="text-sm font-dpixel">{tier}</span>
      </p>
      <p className="text-xl font-bold font-pretendard">{range}</p>
    </div>
  );
}

export default function TierInfoModal({
  open,
  handleClose,
}: TierInfoModalProps) {
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);

  const tierDescStyle =
    'font-pretendard font-bold text-gray-500 lg:text-lg text-xs';

  return (
    <article>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: 'blur(5px)' }}
      >
        <Box
          className={`${isDarkTheme ? 'bg-main-dark text-white border-main-dark-border border-4' : 'bg-white border-main-shadow border-4'}
          absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] sm:w-[30%] md:w-[50%] w-[80%] h-[70%] shadow-md p-4 flex flex-col gap-4 justify-center`}
        >
          <div className="flex flex-col">
            <p className="font-pretendard font-extrabold text-2xl md:text-3xl">
              TIER INFORMATION
            </p>
            <p className={tierDescStyle}>
              수집한 카드의 개수에 따라 티어가 부여됩니다
            </p>
          </div>
          <Badge
            tier={'BEGINNER'}
            range={'0 ~ 5'}
            color={`bg-beginner text-white ${BadgeCommon}`}
          />
          <p className={tierDescStyle}>
            당신은 카페 월드의 초보! 갈 길이 멉니다ㅜㅜ
          </p>
          <Badge
            tier={'JUNIOR'}
            range={'6 ~ 15'}
            color={`bg-junior text-white ${BadgeCommon}`}
          />
          <p className={tierDescStyle}>열심히 카페를 다니고 있는 주니어에요</p>
          <Badge
            tier={'SENIOR'}
            range={'16 ~ 29'}
            color={`bg-senior text-white ${BadgeCommon}`}
          />
          <p className={tierDescStyle}>
            커피 좀 마셔봤다는 시니어가 되셨네요 후훗
          </p>
          <Badge
            tier={'EXPERT'}
            range={'30 ~ 49'}
            color={getExpertTierStyle(BadgeCommon)}
          />
          <p className={tierDescStyle}>
            어엿한 카페 고수입니다 뿌듯하셔도 좋아요!!
          </p>
          <div className="relative flex items-center gap-3">
            <div className={ModalMasterEffectStyle}></div>
            <p className={getMasterTierStyle(BadgeCommon)}>
              <span className="text-sm font-dpixel">MASTER</span>
            </p>
            <p className="z-10 relative text-xl font-bold font-pretendard">
              50
            </p>
          </div>
          <p className={tierDescStyle}>마스터여, 당신은 월드의 주인입니다</p>
        </Box>
      </Modal>
    </article>
  );
}
