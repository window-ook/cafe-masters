import { useCheckStore } from 'utils/store';
import {
  getBadgeCommon,
  getExpertTierStyle,
  getMasterEffectStyle,
  getMasterTierStyle,
} from 'utils/styles';
import { Box, Modal } from '@mui/material';
import { BadgeProps } from 'types/types';

interface TierInfoModalProps {
  open: boolean;
  handleClose: () => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30%',
  height: '65%',
  bgcolor: 'white',
  boxShadow: 24,
  p: 4,
};

function Badge({ tier, range, color }: BadgeProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={color}>
        <span className="text-sm font-dpixel">{tier}</span>
      </div>
      <span className="text-xl font-dpixel">{range}</span>
    </div>
  );
}

export default function TierInfoModal({
  open,
  handleClose,
}: TierInfoModalProps) {
  const isDarkTheme = useCheckStore((state: any) => state.isDarkTheme);

  const tierDescStyle = 'sm:text-lg text-xs font-dpixel';

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: 'blur(5px)' }}
      >
        <Box
          className={`${isDarkTheme ? 'bg-darkbg text-white border-darkaccent border-4' : 'bg-white border-mainShadow border-4'}
          absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] sm:w-[30%] w-[80%] h-[70%] shadow-md p-4 flex flex-col gap-4 justify-center`}
        >
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-dpixel">
              TIER INFORMATION
            </span>
            <span className={tierDescStyle}>
              수집한 카드의 개수에 따라 티어가 부여됩니다
            </span>
          </div>
          <Badge
            tier={'BEGINNER'}
            range={'0 ~ 5'}
            color={`bg-beginner text-white ${getBadgeCommon}`}
          />
          <span className={tierDescStyle}>
            당신은 카페 월드의 초보! 갈 길이 멉니다ㅜㅜ
          </span>
          <Badge
            tier={'JUNIOR'}
            range={'6 ~ 15'}
            color={`bg-junior text-white ${getBadgeCommon}`}
          />
          <span className={tierDescStyle}>
            열심히 카페를 다니고 있는 주니어에요
          </span>
          <Badge
            tier={'SENIOR'}
            range={'16 ~ 29'}
            color={`bg-senior text-white ${getBadgeCommon}`}
          />
          <span className={tierDescStyle}>
            커피 좀 마셔봤다는 시니어가 되셨네요 후훗
          </span>
          <Badge
            tier={'EXPERT'}
            range={'30 ~ 49'}
            color={getExpertTierStyle(getBadgeCommon)}
          />
          <span className={tierDescStyle}>
            어엿한 카페 고수입니다 뿌듯하셔도 좋아요!!
          </span>
          <div className="flex items-center gap-3 relative">
            <div className={getMasterEffectStyle('w-[15%]')}></div>
            <div className={getMasterTierStyle(getBadgeCommon)}>
              <span className="text-sm font-dpixel">MASTER</span>
            </div>
            <span className="relative z-10 text-xl font-dpixel">50</span>
          </div>
          <span className={tierDescStyle}>
            마스터여, 당신은 월드의 주인입니다
          </span>
        </Box>
      </Modal>
    </div>
  );
}
