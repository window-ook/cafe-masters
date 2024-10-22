import Chip from '@mui/material/Chip';
import { getCollectedBadgeStyle } from 'utils/styles';

export default function CollectedBadge() {
  return <Chip label="COLLECTED" className={getCollectedBadgeStyle()} />;
}
