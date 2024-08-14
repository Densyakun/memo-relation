import useMemo from "@/lib/useMemo";
import { Typography } from "@mui/material";

export default function Memo({ id }: { id: string }) {
  const { data, error, isLoading } = useMemo(id);

  if (error) return "Failed to load user";
  if (isLoading) return "Loading...";
  if (!data) return null;

  return (
    <Typography sx={{ whiteSpace: "pre-line" }}>
      {data.text}
    </Typography>
  );
}