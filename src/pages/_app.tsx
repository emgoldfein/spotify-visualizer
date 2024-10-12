import { SessionProvider } from "next-auth/react";
import { Backdrop, CssBaseline, Container } from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            background: "url(images/background.svg)",
          },
        }}
      />
      <Container
        style={{
          maxWidth: "100%",
          padding: " 0",
          margin: 0,
          height: "100vh",
          overflowY: "hidden",
        }}
      >
        <Component {...pageProps} />
      </Container>
    </SessionProvider>
  );
}
