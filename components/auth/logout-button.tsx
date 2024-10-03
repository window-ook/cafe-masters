'use client';

import { Button } from '@material-tailwind/react';

export default function LogoutButton() {
  return (
    <Button
      className="bg-main text-white shadow-md"
      onClick={() => console.log('로그아웃 되었습니다.')}
    >
      로그아웃
    </Button>
  );
}
