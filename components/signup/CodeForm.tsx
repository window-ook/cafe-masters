interface OtpFormProps {
  otp: string;
  setOtp: (state: string) => void;
}

export default function CodeForm({ otp, setOtp }: OtpFormProps) {
  return (
    <section className="flex flex-col gap-6">
      <span data-cy="otp-title" className="text-xl font-dpixel">
        인증 코드
      </span>
      <input
        data-cy="otp-input"
        value={otp}
        onChange={e => setOtp(e.target.value)}
        placeholder="6자리 인증 코드를 입력하세요"
        type="text"
        className="p-2"
      />
    </section>
  );
}
