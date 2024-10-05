export default function Badge({ tier }) {
  return (
    <div
      className={`${tier === 'amateur' ? 'bg-pink-100' : tier === 'expert' ? 'bg-light-blue-500' : 'bg-main'} rounded-xl w-16 h-6 py-2 text-center text-white flex items-center justify-center`}
    >
      <span>
        {tier === 'amateur'
          ? '아마추어'
          : tier === 'expert'
            ? '고수'
            : '마스터'}
      </span>
    </div>
  );
}
