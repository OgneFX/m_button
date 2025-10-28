import React, { useState, useRef } from "react";
import "./redCartoonButton.module.scss";

type Props = {
  size?: number; // базовый размер в px (width/height)
  label?: string; // текст на кнопке (можно пустой)
  onClick?: () => void;
  clickSoundUrl?: string; // опционально: путь к mp3 для звука щелчка
};

export const RedCartoonButton: React.FC<Props> = ({
  size = 220,
  label = "",
  onClick,
  clickSoundUrl,
}) => {
  const [pressed, setPressed] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = () => {
    // play sound if present
    if (clickSoundUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(clickSoundUrl);
        audioRef.current.preload = "auto";
      }
      // ignore promise result
      void audioRef.current.play().catch(() => {});
    }

    // set animation state
    setPressed(true);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    // длина анимации ~ 550ms (подстраивается под scss)
    timeoutRef.current = window.setTimeout(() => {
      setPressed(false);
    }, 550);

    // вызов внешнего обработчика
    if (onClick) onClick();
  };

  // size controls svg viewport size with CSS variable
  return (
    <div className='rcb-wrapper' style={{ ["--rcb-size" as any]: `${size}px` }}>
      <button
        aria-pressed={pressed}
        className={`rcb-button ${pressed ? "rcb-pressed" : ""}`}
        onClick={handleClick}
      >
        <svg
          className='rcb-svg'
          viewBox='0 0 200 200'
          width={size}
          height={size}
          xmlns='http://www.w3.org/2000/svg'
          role='img'
          aria-label={label || "Red button"}
        >
          {/* Drop shadow */}
          <defs>
            <filter id='rcb-drop' x='-30%' y='-30%' width='160%' height='160%'>
              <feDropShadow
                dx='0'
                dy='8'
                stdDeviation='10'
                floodColor='#c21'
                floodOpacity='0.6'
              />
            </filter>

            {/* rough outline stroke by slightly offset duplicate */}
            <radialGradient id='rcb-grad' cx='35%' cy='35%' r='80%'>
              <stop offset='0%' stopColor='#ff8a8a' />
              <stop offset='60%' stopColor='#ff2b2b' />
              <stop offset='100%' stopColor='#c30000' />
            </radialGradient>

            {/* subtle inner shadow */}
            <filter id='inner-shadow'>
              <feOffset dx='0' dy='2' />
              <feGaussianBlur stdDeviation='3' result='offset-blur' />
              <feComposite
                operator='out'
                in='SourceGraphic'
                in2='offset-blur'
                result='inverse'
              />
              <feFlood floodColor='rgba(0,0,0,0.25)' result='color' />
              <feComposite
                operator='in'
                in='color'
                in2='inverse'
                result='shadow'
              />
              <feComposite operator='over' in='shadow' in2='SourceGraphic' />
            </filter>

            {/* glossy highlight mask */}
            <linearGradient id='rcb-shine' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0' stopColor='rgba(255,255,255,0.95)' />
              <stop offset='0.4' stopColor='rgba(255,255,255,0.25)' />
              <stop offset='1' stopColor='rgba(255,255,255,0)' />
            </linearGradient>
          </defs>

          {/* shadow ellipse */}
          <ellipse cx='100' cy='150' rx='68' ry='18' fill='rgba(0,0,0,0.45)' />

          {/* main shape group */}
          <g filter='url(#rcb-drop)' transform='translate(0,0)'>
            {/* slightly rough outline - duplicate with stroke and a wiggle via path */}
            <path
              className='rcb-outline'
              d='M34 103c0-36 27-55 66-55s66 20 66 55-27 55-66 55S34 139 34 103Z'
              fill='none'
              stroke='#5b0000'
              strokeWidth='6'
              strokeLinecap='round'
              strokeLinejoin='round'
              opacity='0.28'
            />

            {/* main red blob */}
            <path
              className='rcb-main'
              d='M36 102c0-36 27-52 66-52s66 18 66 52-27 54-66 54S36 138 36 102Z'
              fill='url(#rcb-grad)'
              stroke='#7a0000'
              strokeWidth='3'
              strokeLinejoin='round'
              style={{ filter: "url(#inner-shadow)" }}
            />

            {/* glossy top highlight */}
            <path
              className='rcb-shine'
              d='M52 72c18-22 76-26 96 0-22-6-77-6-96 0z'
              fill='url(#rcb-shine)'
              opacity='0.95'
            />

            {/* small sparkle accent - will animate on click */}
            <g className='rcb-sparkle' transform='translate(138,62)'>
              <polygon
                points='0,-6 2,-2 6,0 2,2 0,6 -2,2 -6,0 -2,-2'
                fill='#fff'
                opacity='0.95'
              />
            </g>

            {/* inner cartoon rim (white thin) */}
            <path
              d='M54 98c0-20 18-32 46-32s46 12 46 32-18 32-46 32S54 118 54 98Z'
              fill='none'
              stroke='rgba(255,255,255,0.25)'
              strokeWidth='1.5'
            />
          </g>

          {/* label */}
          {label ? (
            <text
              x='100'
              y='112'
              textAnchor='middle'
              fontFamily="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
              fontWeight='700'
              fontSize='28'
              fill='#fff'
              style={{ pointerEvents: "none" }}
            >
              {label}
            </text>
          ) : null}
        </svg>
      </button>
    </div>
  );
};

export default RedCartoonButton;
