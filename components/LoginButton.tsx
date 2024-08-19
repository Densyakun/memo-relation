import { Button, Typography } from "@mui/material";
import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <Typography gutterBottom>
          {session.user?.email}
        </Typography>
        <Button variant="outlined" onClick={() => signOut()}>Sign out</Button>
      </>
    );
  }
  return <Button variant="outlined" onClick={() => signIn()}>Sign in</Button>;
}