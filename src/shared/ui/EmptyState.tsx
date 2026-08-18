import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Box
      sx={{
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 3,
        p: 3,
        textAlign: "center",
        bgcolor: "background.paper",
      }}
    >
      <Typography sx={{fontWeight:700}}>{title}</Typography>

      {description ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.75, lineHeight: 1.8 }}
        >
          {description}
        </Typography>
      ) : null}
    </Box>
  );
}
