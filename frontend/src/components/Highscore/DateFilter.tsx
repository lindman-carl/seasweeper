import React from "react";
import { getDateString } from "../../utils/gameUtils";

type Props = {
  handleDailyFilter: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

const dateString = getDateString(new Date());

export const DateFilter = ({ handleDailyFilter, value }: Props) => {
  return (
    <input
      type="date"
      value={value}
      onChange={handleDailyFilter}
      min={"2023-02-03"}
      max={dateString}
      className="w-32
      mr-6
      ml-1 shrink
      px-1
      bg-transparent
      border-b border-sky-600
      text-sm
      focus:border-sky-900 focus:drop-shadow-md
      text-sky-900
      placeholder:text-sky-600
      focus:outline-none;"
    />
  );
};
