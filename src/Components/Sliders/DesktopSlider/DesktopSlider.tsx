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
  const [velocity, setVelocity] = useState(0); // Скорость скролла

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const accumulatedDelta = useRef<number>(0);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Функция анимации инерции
  const animateInertia = () => {
    if (Math.abs(velocity) < 0.1) {
      setVelocity(0);
      return;
    }

    // Замедляем скорость
    const newVelocity = velocity * 0.92;
    setVelocity(newVelocity);

    // Если скорость достаточно велика, меняем слайд
    if (Math.abs(newVelocity) > 2) {
      setCurrentIndex((prev) => {
        let newIndex = prev;

        if (newVelocity > 0) {
          newIndex = Math.min(prev + 1, slides.length - 1);
        } else {
          newIndex = Math.max(prev - 1, 0);
        }

        if (newIndex !== prev) {
          const selectedSlide = slides[newIndex];
          if (selectedSlide) {
            setSelectedCountryId(selectedSlide.id);
          }
        }

        return newIndex;
      });
    }

    animationRef.current = requestAnimationFrame(animateInertia);
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    const now = Date.now();
    const deltaTime = now - lastTimeRef.current;
    lastTimeRef.current = now;

    // Накапливаем дельту для быстрого скролла
    accumulatedDelta.current += e.deltaY;

    // Устанавливаем новую скорость (чем быстрее крутим, тем выше скорость)
    const newVelocity = e.deltaY / Math.max(deltaTime, 16); // Нормализуем по времени
    setVelocity((prev) => prev * 0.5 + newVelocity * 2); // Добавляем инерцию

    // Останавливаем предыдущую анимацию инерции
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Запускаем новую анимацию инерции
    animationRef.current = requestAnimationFrame(animateInertia);

    // Мгновенная реакция на колесо
    setCurrentIndex((prev) => {
      let newIndex = prev;
      let deltaChange = 0;

      // Чем сильнее прокрутили, тем больше слайдов пропускаем
      if (Math.abs(accumulatedDelta.current) > 30) {
        deltaChange = Math.sign(accumulatedDelta.current);
        accumulatedDelta.current = 0;
      } else if (Math.abs(e.deltaY) > 20) {
        deltaChange = Math.sign(e.deltaY);
      }

      if (deltaChange > 0 && prev < slides.length - 1) {
        newIndex = Math.min(prev + 1, slides.length - 1);
      } else if (deltaChange < 0 && prev > 0) {
        newIndex = Math.max(prev - 1, 0);
      }

      if (newIndex !== prev) {
        const selectedSlide = slides[newIndex];
        if (selectedSlide) {
          setSelectedCountryId(selectedSlide.id);
        }
      }

      return newIndex;
    });

    // Сбрасываем таймаут
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    scrollTimeout.current = setTimeout(() => {
      accumulatedDelta.current = 0;
      setVelocity(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }, 150);
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [slides.length, slides]);

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

          // Добавляем инерцию в трансформацию
          const translateX = (index - currentIndex) * 180 + velocity * 2;

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
              style={{
                transform: `translateX(${translateX}px) scale(${
                  isActive ? 1.1 : isPrev || isNext ? 0.85 : 0.8
                })`,
                opacity: isActive ? 1 : isPrev || isNext ? 0.5 : 0,
                transition:
                  velocity === 0
                    ? "transform 0.3s ease, opacity 0.3s ease"
                    : "transform 0.1s linear, opacity 0.1s linear",
              }}
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
