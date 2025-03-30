export default function Help() {
  const googleForm = 'https://forms.gle/7jEc8cKfELoKDFPb7';

  return (
      <div className='flex flex-col gap-4'>
          <article>
              <p className='font-pretendard'>버그를 발견하셨다면 저에게 알려주세요!</p>
          </article>
      <button
        onClick={() => window.open(googleForm, '_blank')}
        className="px-4 py-2 rounded-md bg-main text-white hover:bg-opacity-80 transition duration-150 ease"
      >
        버그 제보하기
      </button>
    </div>
  );
}
