import appState from "@/lib/state";
import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { mutate } from "swr";

type IFormInput = {
  text: string;
};

export default function PostMemo() {
  const [disabled, setDisabled] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      text: "",
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    setDisabled(true);
    fetch(`/api/memos`, {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(json => {
        reset();

        if (appState.memos && appState.memos.length < 10)
          appState.memos.push(json);
        else
          mutate(`/api/number-of-memos`);
      })
      .finally(() => setDisabled(false));
  };

  return <form onSubmit={handleSubmit(onSubmit)}>
    <Stack direction="row">
      <Controller
        name="text"
        control={control}
        rules={{ required: true }}
        render={({ field }) => <TextField multiline variant="outlined" {...field} />}
      />
      <Button type="submit" disabled={disabled}>
        追加
      </Button>
    </Stack>
  </form>;
}