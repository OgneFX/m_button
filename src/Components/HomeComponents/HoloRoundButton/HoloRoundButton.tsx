import React, { useState } from "react";
import styles from "./HoloRoundButton.module.scss";
import { DonateModal } from "./DonatButton/DonateModal/DonateModal";
import { BeamEffect } from "./DonatButton/BeamEffect/BeamEffect";

interface HoloRoundButtonProps {
  icon?: React.ReactNode;
  onDonateComplete?: () => void;
}

export const HoloRoundButton: React.FC<HoloRoundButtonProps> = ({ icon }) => {
  const [active, setActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [donation, setDonation] = useState(0);

  const handlePress = () => {
    setActive(true);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleDonationSelect = (amount: number) => setDonation(amount);

  const handleDonateComplete = () => {
    setShowModal(false);
  };

  return (
    <>
      <button
        className={`${styles.holoRoundButton} ${active ? styles.active : ""} ${
          showModal ? styles.glow : ""
        }`}
        onMouseDown={handlePress}
        onTouchStart={handlePress}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        {showModal && (
          <div className={styles.beamContainer}>
            <BeamEffect />
          </div>
        )}
      </button>

      {showModal && (
        <DonateModal
          onClose={handleCloseModal}
          onDonationSelect={handleDonationSelect}
          currentAmount={donation}
          onDonateComplete={handleDonateComplete}
        />
      )}
    </>
  );
};
