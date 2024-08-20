import useMyMemo from "@/lib/useMyMemo";
import { Box, Chip, Typography } from "@mui/material";
import MemoSearch from "./MemoSearch";
import MemoList from "./MemoList";
import { mutate } from "swr";

export default function MemoDetails({ id }: { id: string }) {
  const { data: memo } = useMyMemo(id as string);

  if (!memo) return null;

  return <>
    <Typography variant="h5">
      タグ
    </Typography>
    <Box>
      {memo.tagMemos && memo.tagMemos.map((memo1, index) =>
        <Chip
          key={memo1._id}
          sx={{ m: 0.5 }}
          label={memo1.text}
          onClick={() => window.location.href = `/memos/${memo1._id}`}
          onDelete={() => {
            memo.tagMemos = [
              ...memo.tagMemos.slice(0, index),
              ...memo.tagMemos.slice(index + 1)
            ];

            fetch(`/api/memos/${memo?._id}?${memo.tagMemos.map(memo => `tagMemos[]=${memo._id}`).join("&")}`, { method: "PUT" })
              .then(_ =>
                mutate(`/api/memos/${memo?._id}`)
              );
          }}
        />
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