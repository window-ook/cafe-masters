import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '30%',
  height: '25%',
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
        <Box sx={style} className="flex flex-col gap-2 justify-center">
          <div className="flex items-center gap-3">
            <div className="bg-beginner text-white rounded-xl w-20 h-6 py-2 flex items-center justify-center hover:cursor-pointer">
              <span className="text-sm font-dpixel">BEGINNER</span>
            </div>
            <span className="text-sm font-dpixel">
              당신은 카페 마스터즈 월드의 초보! 갈 길이 멉니다ㅜㅜ
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-junior text-white rounded-xl w-20 h-6 py-2 flex items-center justify-center hover:cursor-pointer">
              <span className="text-sm font-dpixel">JUNIOR</span>
            </div>
            <span className="text-sm font-dpixel">
              이제 좀 카페를 즐겨본 주니어시군요?
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-senior text-white rounded-xl w-20 h-6 py-2 flex items-center justify-center hover:cursor-pointer">
              <span className="text-sm font-dpixel">SENIOR</span>
            </div>
            <span className="text-sm font-dpixel">
              커피 좀 마셔봤다는 시니어가 되셨네요 후훗
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-expert-side via-expert-via to-expert-side bg-[length:200%_200%] animate-gradientMove text-black shadow-md rounded-xl w-20 h-6 py-2 flex items-center justify-center hover:cursor-pointer">
              <span className="text-sm font-dpixel">EXPERT</span>
            </div>
            <span className="text-sm font-dpixel">
              내가 누구? 카페 고수! 내가 누구!
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-master-side via-master-via to-master-side bg-[length:200%_200%] animate-gradientMove text-white shadow-md rounded-xl w-20 h-6 py-2 flex items-center justify-center hover:cursor-pointer">
              <span className="text-sm font-dpixel">MASTER</span>
            </div>
            <span className="text-sm font-dpixel">마스터시여, 오셨습니까?</span>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
