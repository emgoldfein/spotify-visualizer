"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { CircularProgress, Grid2, Typography } from "@mui/material";

import WebPlayback from "./_components/webplayback";

export default function Index() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session && session.user && session?.user?.accessToken) {
      setIsLoading(false);
    }
  }, [isLoading, session]);

  if (isLoading) {
    return (
      <Grid2
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        container
      >
        <Grid2 xs={12} item>
          <CircularProgress />
        </Grid2>
      </Grid2>
    );
  } else {
    return (
      <Grid2
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        container
      >
        <WebPlayback token={session?.user?.accessToken} />
      </Grid2>
    );
  }
}
