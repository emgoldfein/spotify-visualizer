import SpotifyWebApi from "spotify-web-api-node";
import { generateRandomString } from "./utils";

var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-email",
  "streaming",
  "user-read-private",
  "user-library-read",
  "user-top-read",
  "app-remote-control",
  "streaming",
  "user-read-playback-position",
  "user-top-read",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
];

// Create state to protect against attacks such as cross-site request forgery.
const state = generateRandomString(16);

// Create the authorization URL
var AUTH_URL = spotifyApi.createAuthorizeURL(scopes, state);

export { spotifyApi, AUTH_URL };
