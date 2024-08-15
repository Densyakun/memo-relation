import MemoList from "@/components/MemoList";
import MemoListPagination from "@/components/MemoListPagination";
import PostMemo from "@/components/PostMemo";
import appState from "@/lib/state";
import { MemoData } from "@/lib/type";
import { Stack } from "@mui/material";
import Head from "next/head";
import useSWR from "swr";
import { useSnapshot } from "valtio";

export default function Home() {
  const { page } = useSnapshot(appState);

  const { data: memos, error, isLoading } = useSWR(`/api/memos?skip=${(page - 1) * 10}`, (url) => fetch(url)
    .then(res => res.json())
    .then(json => {
      if (!Array.isArray(json))
        throw json;

      return json;
    }));

  return (
    <>
      <Head>
        <title>memo-relation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Stack spacing={1}>
        <MemoList memos={memos as MemoData[]} error={error} isLoading={isLoading} href={id => `/memos/${id}`} />
        <MemoListPagination />
        <PostMemo />
      </Stack>
    </>
  );
}
