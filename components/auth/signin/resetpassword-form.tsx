interface ResetpasswordFormProps {
  email: string;
  setEmail: (state: string) => void;
  resetRequested: string;
  resetFn: () => void;
  cancelFn: () => void;
}

export default function ResetpasswordForm({
  email,
  setEmail,
  resetRequested,
  resetFn,
  cancelFn,
}: ResetpasswordFormProps) {
  return (
    <div className="w-80 max-w-screen-lg sm:w-96 flex flex-col gap-4">
      <p className="text-center text-3xl font-bold font-dpixel">
        비밀번호 재설정
      </p>
      <div className="flex gap-4 justify-between items-center">
        <span className="w-20 font-dpixel text-lg">이메일</span>
        <input
          data-cy="resetpassword-email-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="아이디@주소"
          className="border-gray-400 w-full"
        />
      </div>
      <span
        data-cy="success-request-resetpassword"
        className="text-success font-bold"
      >
        {resetRequested}
      </span>
      <button
        data-cy="request-resetpassword-button"
        type="button"
        aria-label="비밀번호 재설정 링크 메일 요청 버튼"
        className="bg-main w-full py-1 hover:bg-opacity-70 hover:cursor-pointer"
        onClick={resetFn}
      >
        <span className="font-dpixel text-lg text-white">재설정하기</span>
      </button>
      <button
        type="button"
        aria-label="비밀번호 재설정 취소 버튼"
        onClick={cancelFn}
        className="bg-blue-500 w-full py-1 hover:bg-opacity-70 hover:cursor-pointer"
      >
        <span className="font-dpixel text-lg text-white">취소</span>
      </button>
    </div>
  );
}
