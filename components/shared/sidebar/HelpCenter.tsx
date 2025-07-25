'use client';

export default function HelpCenter() {
  const googleForm = 'https://forms.gle/7jEc8cKfELoKDFPb7';

  return (
    <div className="flex flex-col gap-4">
      <p className="font-pretendard">버그를 발견하셨다면 알려주세요!</p>
      <button
        onClick={() => window.open(googleForm, '_blank')}
        className="px-4 py-2 rounded-md bg-main text-white hover:bg-opacity-80 transition duration-150 ease"
      >
        버그 제보하기
      </button>
    </div>
  );
}
