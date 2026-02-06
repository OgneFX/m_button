import React, { useState, useEffect, useRef } from "react";
import type { Slide } from "../../../interfaces/interfaces";
import styles from "./desktopSlider.module.scss";

interface SliderProps {
  slides: Slide[];
  setSelectedCountryId: (id: number) => void;
}

export const DesktopSlider: React.FC<SliderProps> = ({
  slides,
  setSelectedCountryId,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (scrollTimeout.current) return;

    setCurrentIndex((prev) => {
      let newIndex = prev;

      if (e.deltaY > 0 && prev < slides.length - 1) {
        newIndex = prev + 1;
      } else if (e.deltaY < 0 && prev > 0) {
        newIndex = prev - 1;
      }

      const selectedSlide = slides[newIndex];
      if (selectedSlide) {
        setSelectedCountryId(selectedSlide.id);
      }

      return newIndex;
    });

    scrollTimeout.current = setTimeout(() => {
      scrollTimeout.current = null;
    }, 500);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const listener = (e: WheelEvent) => handleWheel(e);
    container.addEventListener("wheel", listener, { passive: false });

    if (slides.length > 0) {
      setSelectedCountryId(slides[0].id);
    }

    return () => {
      container.removeEventListener("wheel", listener);
    };
  }, [slides.length]);

  if (!slides || slides.length === 0) {
    return <div className={styles.sliderContainer}>Нет данных</div>;
  }

  return (
    <div className={styles.sliderContainer} ref={containerRef}>
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
              <img src={slide.image} alt={slide.name || ""} />
              {slide.name && <span>{slide.name}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
