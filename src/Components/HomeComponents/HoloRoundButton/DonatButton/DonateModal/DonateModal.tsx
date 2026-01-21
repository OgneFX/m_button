import styles from "./DonateModal.module.scss";
import { HoloCarousel } from "./HoloCarousel/HoloCarousel";
import { useState } from "react";

interface DonateModalProps {
  onClose: () => void;
  onDonationSelect: (amount: number) => void;
  currentAmount: number;
  onDonateComplete: () => void;
}

export const DonateModal = ({
  onClose,
  onDonationSelect,
  currentAmount,
  onDonateComplete,
}: DonateModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePay = () => {
    if (!currentAmount) return; // ничего не выбрано
    setIsAnimating(true);
    onDonateComplete();
    // можно отключить кнопку на время анимации
    setTimeout(() => {
      setIsAnimating(false);
      onClose(); // закрываем модалку после анимации
    }, 2000); // длительность совпадает с CSS-анимацией
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <HoloCarousel
          onSelect={onDonationSelect}
          animateAmount={isAnimating ? currentAmount : null}
        />
        <div className={styles.btnGroup}>
          <button onClick={handlePay} className={styles.closeBtn}>
            Оплатить
          </button>
          <button onClick={onClose} className={styles.closeBtn}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
