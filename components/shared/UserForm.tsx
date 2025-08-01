import React from 'react';

interface IUserForm {
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
}

export default function UserForm({
  email,
  password,
  setEmail,
  setPassword,
}: IUserForm) {
  return (
    <section className="mb-1 flex flex-col gap-4 z-10">
      <label htmlFor="email" className="text-xl ">
        이메일
      </label>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="아이디@주소"
        className="border border-gray-400"
      />
      <label htmlFor="password" className="text-xl ">
        비밀번호
      </label>
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        placeholder="********"
        className="border border-gray-400"
      />
    </section>
  );
}
