import { CollectedBadgeStyle } from 'utils/styles';
import { Chip } from '@mui/material';

export default function CollectedBadge() {
  return (
    <Chip
      label="COLLECTED"
      className={CollectedBadgeStyle}
      sx={{ color: 'white' }}
    />
  );
}
