import React from "react";

type Props = {
  label: string;
  textColor?: string;
  borderColor?: string;
  type?: string;
  onClick?: () => void;
};

const GameOverBoxButton = ({
  label,
  onClick,
  textColor = "text-sky-700",
  borderColor = "border-sky-700",
}: Props) => {
  // generate className to avoid tailwind purging
  const buttonClassName = `gameoverbox-button ${textColor} ${borderColor}`;

  return (
    <div className="gameoverbox-item">
      <button className={buttonClassName} onClick={onClick}>
        {label}
      </button>
    </div>
  );
};

export default GameOverBoxButton;
