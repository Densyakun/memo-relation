import useMemo from "@/lib/useMemo";
import { Box, Chip, Typography } from "@mui/material";
import MemoSearch from "./MemoSearch";

export default function MemoDetails({ id }: { id: string }) {
  const { data: memo } = useMemo(id as string);

  return <>
    <Typography variant="h5">
      タグ
    </Typography>
    <Box>
      {memo?.tagMemos && memo?.tagMemos.map(memo =>
        <Chip key={memo._id} sx={{ m: 0.5 }} label={memo.text} component="a" href={`/memos/${memo._id}`} clickable />
      )}
    </Box>
    <Typography variant="h6">
      別のメモをタグ付け
    </Typography>
    <MemoSearch memo={memo} />
  </>;
}