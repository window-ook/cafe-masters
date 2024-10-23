import { TextField, Typography } from '@mui/material';

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
    <div className="mb-1 flex flex-col gap-6 z-10">
      <Typography className="text-lg font-dpixel">이메일</Typography>
      <TextField
        variant="outlined"
        value={email}
        color="secondary"
        onChange={(e) => setEmail(e.target.value)}
        label="아이디@주소"
        className="border-gray-400 active:border-main p-2"
      />
      <Typography className="text-lg font-dpixel">비밀번호</Typography>
      <TextField
        variant="outlined"
        value={password}
        color="secondary"
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        label="********"
        className="border-gray-400 active:border-main p-2"
      />
    </div>
  );
}
