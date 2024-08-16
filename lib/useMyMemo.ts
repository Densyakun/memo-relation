import useSWR from "swr";
import { MemoData } from "./type";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useMyMemo(id: string) {
  return useSWR<MemoData>(`/api/memos/${id}`, id ? fetcher : async () => { });
}