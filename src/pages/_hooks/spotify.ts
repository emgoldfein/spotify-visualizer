import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { spotifyApi } from "@/lib/spotify";

export default function useSpotify() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      if (session?.error === "Error occurred when refreshing access token") {
        signIn();
      }
      spotifyApi.setAccessToken(session?.user?.accessToken);
      spotifyApi.setRefreshToken(session?.user?.refreshToken);
    }
  }, [session]);

  return spotifyApi;
}
