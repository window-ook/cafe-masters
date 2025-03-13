import { CollectedBadgeStyle } from 'utils/styles';

export default function CollectedBadge() {
  return (
    <div data-cy="collected-badge" className={CollectedBadgeStyle}>
      <span className="font-pretendard font-bold text-white">COLLECTED</span>
    </div>
  );
}
