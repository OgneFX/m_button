// BeamEffect.tsx
import React from "react";
import styles from "./BeamEffect.module.scss";

export const BeamEffect: React.FC = () => {
  const beams = [
    // Центральные мощные лучи
    {
      angle: "0deg",
      length: "250px",
      delay: "0s",
      thickness: "4px",
      opacity: "0.9",
    },
    {
      angle: "0deg",
      length: "280px",
      delay: "0.4s",
      thickness: "3px",
      opacity: "0.7",
    },

    // Широкие левые лучи
    {
      angle: "-25deg",
      length: "220px",
      delay: "0.1s",
      thickness: "3px",
      opacity: "0.8",
    },
    {
      angle: "-45deg",
      length: "190px",
      delay: "0.5s",
      thickness: "2.5px",
      opacity: "0.6",
    },
    {
      angle: "-60deg",
      length: "160px",
      delay: "0.8s",
      thickness: "2px",
      opacity: "0.5",
    },

    // Широкие правые лучи
    {
      angle: "25deg",
      length: "220px",
      delay: "0.2s",
      thickness: "3px",
      opacity: "0.8",
    },
    {
      angle: "45deg",
      length: "190px",
      delay: "0.6s",
      thickness: "2.5px",
      opacity: "0.6",
    },
    {
      angle: "60deg",
      length: "160px",
      delay: "0.9s",
      thickness: "2px",
      opacity: "0.5",
    },

    // Дополнительные мерцающие широкие лучи
    {
      angle: "-15deg",
      length: "240px",
      delay: "0.3s",
      thickness: "2px",
      opacity: "0.4",
      flicker: true,
    },
    {
      angle: "15deg",
      length: "240px",
      delay: "0.7s",
      thickness: "2px",
      opacity: "0.4",
      flicker: true,
    },

    // Экстремальные широкие лучи
    {
      angle: "-75deg",
      length: "140px",
      delay: "1.1s",
      thickness: "1.5px",
      opacity: "0.3",
      flicker: true,
    },
    {
      angle: "75deg",
      length: "140px",
      delay: "1.3s",
      thickness: "1.5px",
      opacity: "0.3",
      flicker: true,
    },
  ];

  return (
    <div className={styles.beamWrapper}>
      {beams.map((beam, index) => (
        <div
          key={index}
          className={`${styles.beam} ${beam.flicker ? styles.flickerBeam : ""}`}
          style={
            {
              "--angle": beam.angle,
              "--beam-length": beam.length,
              "--delay": beam.delay,
              "--thickness": beam.thickness,
              "--opacity": beam.opacity,
            } as React.CSSProperties
          }
        ></div>
      ))}
    </div>
  );
};
