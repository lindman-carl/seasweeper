const GameOverBoxButton = ({
  label,
  onClick,
  textColor = "text-sky-700",
  borderColor = "border-sky-700",
}) => (
  <div className="gameoverbox-item">
    <button
      className={`gameoverbox-button ${textColor} ${borderColor}`}
      onClick={onClick}
    >
      {label}
    </button>
  </div>
);

export default GameOverBoxButton;
