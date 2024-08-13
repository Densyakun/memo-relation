import MemoList from "@/components/MemoList";
import MemoListPagination from "@/components/MemoListPagination";
import PostMemo from "@/components/PostMemo";
import appState from "@/lib/state";
import { Stack } from "@mui/material";
import Head from "next/head";
import useSWR from "swr";
import { useSnapshot } from "valtio";

export default function Home() {
  const { page } = useSnapshot(appState);

  const { data, error, isLoading } = useSWR(`/api/memos?skip=${(page - 1) * 10}`, (url) => fetch(url)
    .then(res => res.json())
    .then(json => {
      if (!Array.isArray(json))
        throw json;

      return json;
    }));

  appState.isLoading = isLoading;
  appState.memos = data;
  appState.error = error;

  return (
    <>
      <Head>
        <title>memo-relation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Stack spacing={1}>
        <MemoList />
        <MemoListPagination />
        <PostMemo />
      </Stack>
    </>
  );
}
