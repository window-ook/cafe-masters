import { getCollectedBadgeStyle } from 'utils/styles';
import { Chip } from '@mui/material';

export default function CollectedBadge() {
  return (
    <Chip
      label="COLLECTED"
      className={getCollectedBadgeStyle()}
      sx={{ color: 'white' }}
    />
  );
}
