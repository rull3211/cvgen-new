import { Box, FormControl, InputLabel } from '@mui/material';

interface LabelWrapperProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export default function LabelWrapper({ label, children, className }: LabelWrapperProps) {
  return (
    <FormControl className={className} fullWidth>
      <InputLabel shrink>{label}</InputLabel>
      <Box mt={1}>
        {children}
      </Box>
    </FormControl>
  );
}