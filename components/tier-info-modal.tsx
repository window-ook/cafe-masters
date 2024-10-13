import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

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

export default function TierInfoModal({ open, handleClose }) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: 'blur(5px)' }}
      >
        <Box sx={style} className="flex flex-col gap-4 justify-center">
          <div className="flex flex-col">
            <span className="text-3xl font-dpixel">TIER INFORMATION</span>
            <span className="text-lg font-dpixel">
              수집한 카드의 개수에 따라 티어가 부여됩니다
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-beginner text-white rounded-xl w-20 h-6 py-2 flex items-center justify-center">
              <span className="text-sm font-dpixel">BEGINNER</span>
            </div>
            <span className="text-xl font-dpixel">0 ~ 5</span>
          </div>
          <span className="font-dpixel">
            당신은 카페 월드의 초보! 갈 길이 멉니다ㅜㅜ
          </span>
          <div className="flex items-center gap-3">
            <div className="bg-junior text-white rounded-xl w-20 h-6 py-2 flex items-center justify-center">
              <span className="text-sm font-dpixel">JUNIOR</span>
            </div>
            <span className="text-xl font-dpixel">6 ~ 15</span>
          </div>
          <span className="font-dpixel">
            열심히 카페를 다니고 있는 주니어에요
          </span>
          <div className="flex items-center gap-3">
            <div className="bg-senior text-white rounded-xl w-20 h-6 py-2 flex items-center justify-center">
              <span className="text-sm font-dpixel">SENIOR</span>
            </div>
            <span className="text-xl font-dpixel">16 ~ 29</span>
          </div>
          <span className="font-dpixel">
            커피 좀 마셔봤다는 시니어가 되셨네요 후훗
          </span>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-expert-side via-expert-via to-expert-side bg-[length:200%_200%] animate-gradient text-black shadow-md shadow-amber-700 rounded-xl w-20 h-6 py-2 flex items-center justify-center">
              <span className="text-sm font-dpixel">EXPERT</span>
            </div>
            <span className="text-xl font-dpixel">30 ~ 49</span>
          </div>
          <span className="font-dpixel">
            어엿한 카페 고수입니다 뿌듯하셔도 좋아요!!
          </span>
          <div className="flex items-center gap-3 relative">
            <div className="absolute inset-0 w-[16%] h-7 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-sm animate-tilt z-0"></div>
            <div className="relative z-10 bg-gradient-to-r from-master-side via-master-via to-master-side bg-[length:200%_200%] animate-gradient text-white rounded-xl w-20 h-6 py-2 flex items-center justify-center">
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