"use client";
import React, { useState, useEffect, useRef } from "react";
// import useSpotify from "../_hooks/spotify";
import {
  Card,
  CardContent,
  IconButton,
  Grid2,
  Typography,
} from "@mui/material";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";

import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
  id: "",
};

function WebPlayback(props) {
  // const spotifyApi = useSpotify();

  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [current_track, setTrack] = useState(track);
  const [deviceId, setDeviceId] = useState("");
  const canvasRef = React.useRef(null);

  useEffect(() => {
    let analyser: AnalyserNode;
    let drawVisual: number;

    async function initializePlayback() {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      let audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);

      // Create gain node and an analyser
      const gain = audioContext.createGain();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyser.connect(gain);

      // init Spotify WebPlayback SDK
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new window.Spotify.Player({
          name: "Web Playback SDK",
          getOAuthToken: (cb) => {
            cb(props.token);
          },
          volume: 1,
        });

        setPlayer(player);

        player.addListener("ready", ({ device_id }) => {
          setDeviceId(device_id);
          console.log("Ready with Device ID", device_id);
        });

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });

        player.addListener("player_state_changed", async (state) => {
          if (!state) {
            return;
          }

          setTrack(state.track_window.current_track);

          player.getCurrentState().then((state) => {
            !state ? setActive(false) : setActive(true);
          });
        });

        player.connect();
      };
    }

    async function visualize() {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext("2d");

        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;

        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        analyser.fftSize = 256;
        const bufferLengthAlt = analyser.frequencyBinCount;

        const dataArrayAlt = new Uint8Array(bufferLengthAlt);

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        const drawAlt = function () {
          drawVisual = requestAnimationFrame(drawAlt);

          analyser.getByteFrequencyData(dataArrayAlt);

          canvasCtx.fillStyle = "rgb(255, 255, 255)";
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

          const barWidth = (WIDTH / bufferLengthAlt) * 2.5;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLengthAlt; i++) {
            barHeight = dataArrayAlt[i];

            canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
            canvasCtx.fillRect(
              x,
              HEIGHT - barHeight * 5,
              barWidth,
              barHeight * 5
            );

            x += barWidth + 1;
          }
        };

        drawAlt();
      }
    }

    initializePlayback().then(() => visualize());
  }, []);

  if (!is_active) {
    return (
      <Grid2
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        container
      >
        <Card
          style={{
            maxWidth: "400px",
          }}
        >
          <CardContent
            style={{
              flex: "1",
              alignItems: "center",
              justifyContent: "space-between",
              display: "flex",
              flexDirection: "column",
              rowGap: "2rem",
            }}
          >
            <img width="300" src="/images/connect-device.png" />
            <Typography variant="body1" align="center">
              Transfer your playback using your Spotify app on your laptop or
              mobile device.
            </Typography>
          </CardContent>
        </Card>
      </Grid2>
    );
  } else {
    return (
      <Grid2
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        container
      >
        <canvas
          ref={canvasRef}
          height={window.innerHeight - 200}
          width={window.innerWidth}
        ></canvas>
        <Card
          style={{
            width: "100%",
            position: "fixed",
            bottom: "0",
          }}
        >
          <CardContent
            style={{
              flex: "1",
              justifyContent: "space-between",
              display: "flex",
              rowGap: "1rem",
            }}
          >
            <Grid2 xs={2} item>
              <img
                width="100"
                src={current_track.album.images[0].url}
                className="now-playing__cover"
                alt="album cover image"
              />
            </Grid2>
            <Grid2
              xs={10}
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
              item
            >
              <Typography variant="h6">{current_track.name}</Typography>
              <Typography>{current_track.artists[0].name}</Typography>
              <div>
                <IconButton
                  onClick={() => {
                    player.previousTrack();
                  }}
                >
                  <SkipPreviousIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    player.togglePlay();
                  }}
                >
                  {is_paused ? (
                    <PlayCircleFilledIcon />
                  ) : (
                    <PauseCircleFilledIcon />
                  )}
                </IconButton>
                <IconButton
                  onClick={() => {
                    player.nextTrack();
                  }}
                >
                  <SkipNextIcon />
                </IconButton>
              </div>
            </Grid2>
          </CardContent>
        </Card>
      </Grid2>
    );
  }
}

export default WebPlayback;
