import React from "react";

type Props = {
  label: string;
  textColor?: string;
  borderColor?: string;
  type?: string;
  onClick?: () => void;
  id?: string;
};

const GameOverBoxButton = ({
  label,
  onClick,
  textColor = "text-sky-700",
  borderColor = "border-sky-700",
  id,
}: Props) => {
  // generate className to avoid tailwind purging
  const buttonClassName = `gameoverbox-button ${textColor} ${borderColor}`;

  return (
    <div className="gameoverbox-item">
      <button className={buttonClassName} onClick={onClick} id={id}>
        {label}
      </button>
    </div>
  );
};

export default GameOverBoxButton;
