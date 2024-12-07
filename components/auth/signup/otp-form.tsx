interface OtpFormProps {
  otp: string;
  setOtp: (state: string) => void;
}

export default function OtpForm({ otp, setOtp }: OtpFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <span className="text-xl font-dpixel">인증 코드</span>
      <input
        value={otp}
        onChange={e => setOtp(e.target.value)}
        placeholder="6자리 인증 코드를 입력하세요"
        type="text"
        className="p-2"
      />
    </div>
  );
}
