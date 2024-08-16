import useMyMemo from "@/lib/useMyMemo";
import { Typography } from "@mui/material";

export default function Memo({ id }: { id: string }) {
  const { data, error, isLoading } = useMyMemo(id);

  if (error) return "Failed to load user";
  if (isLoading) return "Loading...";
  if (!data) return null;

  return (
    <Typography sx={{ whiteSpace: "pre-line" }}>
      {data.text}
    </Typography>
  );
}