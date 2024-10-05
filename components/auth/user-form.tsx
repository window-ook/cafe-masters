import { Input, Typography } from '@material-tailwind/react';

export default function UserForm({ email, password, setEmail, setPassword }) {
  return (
    <div className="mb-1 flex flex-col gap-6">
      <Typography className="-mb-3 text-lg">이메일</Typography>
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        size="lg"
        placeholder="아이디@주소"
        className="border-gray-400 active:border-main p-2"
        labelProps={{
          className: 'before:content-none after:content-none',
        }}
      />
      <Typography className="-mb-3 text-lg">비밀번호</Typography>
      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        size="lg"
        placeholder="********"
        className="border-gray-400 active:border-main p-2"
        labelProps={{
          className: 'before:content-none after:content-none',
        }}
      />
    </div>
  );
}
