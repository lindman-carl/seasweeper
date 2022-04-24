import React from "react";

type Props = {
  icon: JSX.Element;
  value: number;
  tooltip: string;
};

const IconBadge = ({ icon, value, tooltip }: Props) => {
  return (
    // <div className="icon-badge-base">
    <div
      className="
        w-12 h-8 mt-1
        sm:w-20 sm:h-8 sm:mt-0
        md:w-20
        flex justify-center items-center
        select-none
        cursor-default"
    >
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
      >
        <>{icon}</>
        <>{value && <div className="ml-1 sm:ml-2">{value}</div>}</>
      </div>
    </div>
  );
};

export default IconBadge;
