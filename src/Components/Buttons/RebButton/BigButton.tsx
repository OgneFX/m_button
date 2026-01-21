import React, { useState } from "react";
import "./BigButton.scss";

export const BigButton: React.FC = () => {
  const [pressed, setPressed] = useState(false);

  return (
    <div className={`button-wrapper ${pressed ? "pressed" : ""}`}>
      <div className='button-base'>
        <div className='button-shadows'></div>
        <div
          className='button-top'
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
        >
          <span className='button-label'>PRESS</span>
        </div>
      </div>
    </div>
  );
};
