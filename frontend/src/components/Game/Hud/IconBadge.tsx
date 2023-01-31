import React from "react";

type Props = {
  icon: JSX.Element;
  value: number;
  tooltip: string;
  id: string;
};

const IconBadge = ({ icon, value, tooltip, id }: Props) => {
  return (
    <div className="icon-badge-base">
      <div
        className="
          w-full h-full
          mx-4
          font-semibold
          text-sm sm:text-lg
          text-sky-900
          border-sky-900
          flex justify-between items-center"
        data-tip={tooltip}
        data-for="badgeInfo"
        data-id={id}
      >
        <>{icon}</>
        <>{value && <div className="ml-1 sm:ml-2">{value}</div>}</>
      </div>
    </div>
  );
};

export default IconBadge;
