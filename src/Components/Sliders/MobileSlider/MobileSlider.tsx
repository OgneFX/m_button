import React, { useState, useRef, useEffect } from "react";
import type { Slide } from "../../../interfaces/interfaces";
import styles from "./mobileSlider.module.scss";

interface SliderProps {
  slides: Slide[];
  setRegionIndex: (index: number) => void;
}

export const MoblieSlider: React.FC<SliderProps> = ({
  slides,
  setRegionIndex,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < slides.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  useEffect(() => {
    setRegionIndex(currentIndex);
  }, [currentIndex, setRegionIndex]);

  return (
    <div
      className={styles.sliderContainer}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.slider}>
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          const isPrev = index === currentIndex - 1;
          const isNext = index === currentIndex + 1;

          return (
            <div
              key={slide.id}
              className={`${styles.slide} ${
                isActive
                  ? styles.active
                  : isPrev || isNext
                  ? styles.side
                  : styles.hidden
              }`}
            >
              <img src={slide.image} alt={slide.title || ""} />
              {slide.title && <span>{slide.title}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
