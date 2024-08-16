import useMyMemo from "@/lib/useMyMemo";
import { Box, Chip, Typography } from "@mui/material";
import MemoSearch from "./MemoSearch";
import MemoList from "./MemoList";

export default function MemoDetails({ id }: { id: string }) {
  const { data: memo } = useMyMemo(id as string);

  if (!memo) return null;

  return <>
    <Typography variant="h5">
      タグ
    </Typography>
    <Box>
      {memo.tagMemos && memo.tagMemos.map(memo =>
        <Chip key={memo._id} sx={{ m: 0.5 }} label={memo.text} component="a" href={`/memos/${memo._id}`} clickable />
      )}
    </Box>
    <Typography variant="h6">
      別のメモをタグ付け
    </Typography>
    <MemoSearch memo={memo} />
    <Typography variant="h5">
      このメモがタグ付けされたメモ
    </Typography>
    {memo.taggedMemos.length
      ? <MemoList
        memos={memo.taggedMemos}
        href={id => `/memos/${id}`}
      />
      : <Typography>
        （なし）
      </Typography>
    }
  </>;
}