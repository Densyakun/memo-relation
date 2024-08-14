import appState from "@/lib/state";
import { List, ListItem, ListItemButton, ListItemText, Skeleton } from "@mui/material";
import { useSnapshot } from "valtio";

export default function MemoList() {
  const { error, isLoading, memos } = useSnapshot(appState);

  if (error)
    return error.message || "An error has occurred.";

  if (isLoading)
    return <Skeleton variant="rectangular" sx={{ maxWidth: 360 }} />;

  if (!memos) return null;

  return <List>
    {memos.map(memo => <ListItem key={memo._id!.toString()} dense disablePadding>
      <ListItemButton href={`/memos/${memo._id}`}>
        <ListItemText primary={memo.text.replaceAll(/\s+/gi, ' ')} />
      </ListItemButton>
    </ListItem>)}
  </List>;
}