import { useCheckStore } from 'utils/store';
import {
  getExpertTierStyle,
  getMasterEffectStyle,
  getMasterTierStyle,
} from 'utils/styles';
import { Box, Modal } from '@mui/material';

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

function Badge({ tier, range, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className={color}>
        <span className="text-sm font-dpixel">{tier}</span>
      </div>
      <span className="text-xl font-dpixel">{range}</span>
    </div>
  );
}

export default function TierInfoModal({ open, handleClose }) {
  const isDarkTheme = useCheckStore((state) => state.isDarkTheme);
  const common = 'rounded-xl w-20 h-6 py-2 flex items-center justify-center';

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
          sx={style}
          className={`flex flex-col gap-4 justify-center ${isDarkTheme ? 'bg-darkbg text-white border-darkaccent border-4' : 'bg-white border-mainShadow border-4'}`}
        >
          <div className="flex flex-col">
            <span className="text-3xl font-dpixel">TIER INFORMATION</span>
            <span className="text-lg font-dpixel">
              수집한 카드의 개수에 따라 티어가 부여됩니다
            </span>
          </div>
          <Badge
            tier={'BEGINNER'}
            range={'0 ~ 5'}
            color={`bg-beginner text-white ${common}`}
          />
          <span className="font-dpixel">
            당신은 카페 월드의 초보! 갈 길이 멉니다ㅜㅜ
          </span>
          <Badge
            tier={'JUNIOR'}
            range={'6 ~ 15'}
            color={`bg-junior text-white ${common}`}
          />
          <span className="font-dpixel">
            열심히 카페를 다니고 있는 주니어에요
          </span>
          <Badge
            tier={'SENIOR'}
            range={'16 ~ 29'}
            color={`bg-senior text-white ${common}`}
          />
          <span className="font-dpixel">
            커피 좀 마셔봤다는 시니어가 되셨네요 후훗
          </span>
          <Badge
            tier={'EXPERT'}
            range={'30 ~ 49'}
            color={getExpertTierStyle(common)}
          />
          <span className="font-dpixel">
            어엿한 카페 고수입니다 뿌듯하셔도 좋아요!!
          </span>
          <div className="flex items-center gap-3 relative">
            <div className={getMasterEffectStyle('w-[18%]')}></div>
            <div className={getMasterTierStyle(common)}>
              <span className="text-sm font-dpixel">MASTER</span>
            </div>
            <span className="relative z-10 text-xl font-dpixel">50</span>
          </div>
          <span className="font-dpixel">
            마스터여, 당신은 월드의 주인입니다
          </span>
        </Box>
      </Modal>
    </div>
  );
}
