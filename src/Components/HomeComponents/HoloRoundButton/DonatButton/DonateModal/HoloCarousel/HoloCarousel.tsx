import React, { useState, useRef, useEffect } from "react";
import styles from "./HoloCarousel.module.scss";
import { HoloDonateButton } from "../HoloCarousel/HoloDonateButton/HoloDonateButton";
import StarIcon from "../../../../../../Assets/telegram-star.svg?react";

interface HoloCarouselProps {
  onSelect: (amount: number) => void;
  animateAmount?: number | null;
}

export const HoloCarousel: React.FC<HoloCarouselProps> = ({ onSelect }) => {
  const [page, setPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const pages = [
    { title: "1 уровень", amounts: [100, 200, 500] },
    { title: "2 уровень", amounts: [600, 800, 1000] },
    { title: "3 уровень", amounts: [1500, 3000, 7000] },
    { title: "Выбери сам", custom: true },
  ];

  // скролл колесиком
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) nextPage();
      else prevPage();
    };
    const container = containerRef.current;
    container?.addEventListener("wheel", handleWheel);
    return () => container?.removeEventListener("wheel", handleWheel);
  }, [page]);

  const nextPage = () => setPage((p) => Math.min(p + 1, pages.length - 1));
  const prevPage = () => setPage((p) => Math.max(p - 1, 0));

  // обработка свайпов
  useEffect(() => {
    let startX = 0;
    const handleTouchStart = (e: TouchEvent) => (startX = e.touches[0].clientX);
    const handleTouchEnd = (e: TouchEvent) => {
      const delta = e.changedTouches[0].clientX - startX;
      if (delta > 50) prevPage();
      if (delta < -50) nextPage();
    };
    const container = containerRef.current;
    container?.addEventListener("touchstart", handleTouchStart);
    container?.addEventListener("touchend", handleTouchEnd);
    return () => {
      container?.removeEventListener("touchstart", handleTouchStart);
      container?.removeEventListener("touchend", handleTouchEnd);
    };
  }, [page]);

  return (
    <div className={styles.carousel} ref={containerRef}>
      <h3 className={styles.levelTitle}>{pages[page].title}</h3>

      <div className={styles.slideWrapper}>
        {pages[page].custom ? (
          <div className={styles.customInputContainer}>
            <div className={styles.starGropt}>
              <StarIcon className={styles.starIcon} />
              <span className={styles.hint}>?</span>
            </div>

            <input
              type='number'
              placeholder='Введите сумму'
              className={styles.customInput}
              onChange={(e) => onSelect(Number(e.target.value))}
            />
          </div>
        ) : (
          pages[page].amounts?.map((amount) => (
            <HoloDonateButton key={amount} amount={amount} onClick={onSelect} />
          ))
        )}
      </div>

      <div className={styles.navArrows}>
        <button
          onClick={prevPage}
          className={`${styles.arrowBtn} ${page === 0 ? styles.disabled : ""}`}
        >
          ‹
        </button>
        <button
          onClick={nextPage}
          className={`${styles.arrowBtn} ${
            page === pages.length - 1 ? styles.disabled : ""
          }`}
        >
          ›
        </button>
      </div>
    </div>
  );
};
