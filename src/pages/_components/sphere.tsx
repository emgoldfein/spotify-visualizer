import React, { useState, useEffect } from "react";
import { animated, useSpring } from "@react-spring/three";

function Sphere({ avgBPM, isPaused }) {
  const [bpm, setBPM] = useState(avgBPM);

  useEffect(() => {
    setBPM(avgBPM);
  }, [avgBPM]);

  const { scale } = useSpring({
    to: { scale: 4 },
    from: { scale: 5 },
    config: bpm * 1000,
    loop: true,
  });

  return (
    <animated.mesh scale={isPaused ? 1 : scale}>
      <sphereGeometry args={[1, 32]} />
      <meshBasicMaterial color="royalblue" />
    </animated.mesh>
  );
}

export default Sphere;
