import Memo from "@/components/Memo";
import useMemo from "@/lib/useMemo";
import { Box, Button, Stack } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";

export default function UserPage() {
  const { query } = useRouter();
  const { data } = useMemo(query.id as string);

  return (
    <>
      <Head>
        <title>{data ? `${data.text} - memo-relation` : "memo-relation"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Stack spacing={1}>
        <Box>
          <Button variant="outlined" href="/">
            {"< Back"}
          </Button>
        </Box>
        <Memo id={query.id as string} />
      </Stack>
    </>
  );
}