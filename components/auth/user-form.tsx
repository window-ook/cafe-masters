interface UserForm {
  email: string;
  password: string;
  setEmail: any;
  setPassword: any;
}

export default function UserForm({
  email,
  password,
  setEmail,
  setPassword,
}: UserForm) {
  return (
    <div className="mb-1 flex flex-col gap-4 z-10">
      <span className="text-xl font-dpixel">이메일</span>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="아이디@주소"
        className="border-gray-400"
      />
      <span className="text-xl font-dpixel">비밀번호</span>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="********"
        className="border-gray-400"
      />
    </div>
  );
}
