import { Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import MemoList from "./MemoList";
import { MemoData } from "@/lib/type";
import { Controller, useForm } from "react-hook-form";
import { mutate } from "swr";

export default function MemoSearch({ memo }: { memo?: MemoData }) {
  const { control, watch } = useForm({
    defaultValues: {
      text: "",
    },
  });

  const [memos1, setMemos1] = useState<{
    _id: string;
    text: string;
  }[]>([]);

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.text)
        fetch(`/api/memos?text=${value.text}`)
          .then(res => res.json())
          .then(json => {
            const memos = json as MemoData[];

            if (memo?._id) {
              const index = memos.findIndex(memo1 => memo1._id === memo?._id);
              if (index !== -1)
                memos.splice(index, 1);
            }

            memos.sort((memoA, memoB) => (memoB.text === value.text ? 1 : 0) - (memoA.text === value.text ? 1 : 0));

            setMemos1(memos.filter(memo1 => memo?.tagMemos.findIndex(memo => memo._id === memo1._id) === -1) as {
              _id: string;
              text: string;
            }[]);
          });
      else
        setMemos1([]);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return <>
    <Stack direction="row">
      <Controller
        name="text"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <TextField multiline variant="outlined" {...field} />}
      />
    </Stack>
    <MemoList memos={memos1} onClick={memo1 => {
      if (!memo) return;

      const index = memos1.findIndex(memo => memo._id === memo1._id);
      memos1.splice(index, 1);
      setMemos1([...memos1]);

      memo.tagMemos.push(memo1);

      fetch(`/api/memos/${memo._id}?${memo.tagMemos.map(memo => memo._id).map(id => `tagMemos[]=${id}`).join("&")}`, { method: "PUT" })
        .then(_ =>
          mutate(`/api/memos/${memo._id}`)
        );
    }} />
  </>;
}