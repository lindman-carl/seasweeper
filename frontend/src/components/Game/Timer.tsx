import React from "react";

type Props = {
  time: number;
};

const Timer = ({ time }: Props) => {
  const formatTime = () => {
    const seconds = Math.floor(time / 1000);
    const hundreds = Math.floor((time % 1000) / 100);

    return (
      <>
        <div className="w-min mt-2 text-left text-4xl justify-self-end">
          {seconds}
        </div>
        <div className="w-3 mt-2 pt-px text-right text-lg font-medium">
          {hundreds}
        </div>
      </>
    );
  };
  return (
    <div
      className="
        w-full h-12 min-w-[6rem] 
        border-b-2 border-sky-800
        mx-auto
        px-4
        text-sky-900  
        font-mono
        flex justify-center items-start
        cursor-default
        select-none"
    >
      {time ? formatTime() : " "}
    </div>
  );
};

export default Timer;
