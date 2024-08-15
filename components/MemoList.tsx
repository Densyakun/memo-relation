import { MemoData } from "@/lib/type";
import { List, ListItem, ListItemButton, ListItemText, Skeleton } from "@mui/material";

export default function MemoList({
  memos,
  error,
  isLoading = false,
  onClick = () => { },
  href,
}: {
  memos: MemoData[];
  error?: Error;
  isLoading?: boolean;
  onClick?: (id: string) => void;
  href?: (id: string) => string;
}) {
  if (error)
    return error.message || "An error has occurred.";

  if (isLoading)
    return <Skeleton variant="rectangular" sx={{ maxWidth: 360 }} />;

  if (!memos) return null;

  return <List>
    {memos.map(memo => {
      const id = memo._id as string;

      return <ListItem key={id} dense disablePadding>
        {href ?
          <ListItemButton href={href(id)}>
            <ListItemText primary={memo.text.replaceAll(/\s+/gi, ' ')} />
          </ListItemButton>
          :
          <ListItemButton onClick={() => onClick(id)}>
            <ListItemText primary={memo.text.replaceAll(/\s+/gi, ' ')} />
          </ListItemButton>
        }
      </ListItem>;
    })}
  </List>;
}