import { Card, CardContent, Button, Grid2, Typography } from "@mui/material";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <Grid2 container>
      <Grid2 xs={6} item>
        <Card style={{ margin: "4rem", height: "100%" }} variant="outlined">
          <CardContent
            style={{
              flex: "1",
              justifyContent: "space-between",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h4">Spotify Visualizer</Typography>
            <Button
              variant="contained"
              onClick={() => {
                signIn("spotify", {
                  callbackUrl: "/",
                });
              }}
            >
              Sign in with Spotify
            </Button>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
}
