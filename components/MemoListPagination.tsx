import appState from "@/lib/state";
import { Pagination, Stack, Typography } from "@mui/material";
import useSWR from "swr";
import { useSnapshot } from "valtio";

export default function MemoListPagination() {
  const { page } = useSnapshot(appState);

  const { data: numberOfMemos } = useSWR(`/api/number-of-memos`, (url) => fetch(url)
    .then(res => res.text())
    .then(text => parseInt(text)));

  if (!numberOfMemos) return null;

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    appState.page = value;
  };

  return (
    <Stack spacing={1}>
      <Typography>Page: {page}</Typography>
      <Pagination count={Math.ceil(numberOfMemos / 10)} page={page} onChange={handleChange} />
    </Stack>
  );
}