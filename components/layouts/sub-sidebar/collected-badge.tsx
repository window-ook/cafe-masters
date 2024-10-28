import { getCollectedBadgeStyle } from 'utils/styles';
import Chip from '@mui/material/Chip';

export default function CollectedBadge() {
  return <Chip label="COLLECTED" className={getCollectedBadgeStyle()} />;
}
