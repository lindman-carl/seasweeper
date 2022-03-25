import { IconContext } from "react-icons";

const IconCheckbox = ({
  icon,
  alternateIcon,
  status,
  value,
  onClick,
  tooltip,
  activeTooltip,
  iconColor,
}) => {
  const checkboxContent = (iconToDisplay = icon) => (
    <div
      className="
            w-full h-full
            flex justify-center items-center"
    >
      <IconContext.Provider value={{ color: iconColor }}>
        {iconToDisplay}
      </IconContext.Provider>
      {value !== undefined && (
        <div className="ml-0 sm:ml-2 font-semibold">
          {value > 0 ? value : "-"}
        </div>
      )}
    </div>
  );
  const inactiveState = () => {
    return (
      <div
        onClick={onClick}
        className={`
        icon-checkbox-base
        icon-checkbox-animation
        text-sky-800
        border-sky-800
        shadow-lg`}
        data-tip={tooltip}
        data-for="checkboxInfo"
      >
        {checkboxContent()}
      </div>
    );
  };

  const activeState = () => {
    return (
      <div
        onClick={onClick}
        className={`
        icon-checkbox-base
        icon-checkbox-animation
        text-red-600 
        border-red-600
        shadow-lg
        border-2
        `}
        data-tip={activeTooltip ? activeTooltip : tooltip}
        data-for="checkboxInfo"
      >
        {checkboxContent(alternateIcon)}
      </div>
    );
  };

  const disabledState = () => {
    return (
      <div
        onClick={onClick}
        className="
              icon-checkbox-base
              text-slate-300
              border-slate-300
              bg-gray-50
              shadow-none
              cursor-not-allowed"
        data-tip={tooltip}
        data-for="checkboxInfo"
      >
        {checkboxContent()}
      </div>
    );
  };

  return value > 0 || value === undefined
    ? status
      ? activeState()
      : inactiveState()
    : disabledState();
};

export default IconCheckbox;
