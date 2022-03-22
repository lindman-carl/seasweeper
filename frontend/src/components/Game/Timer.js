const Timer = ({ time }) => {
  const formatTime = () => {
    const seconds = Math.floor(time / 1000);
    const hundreds = Math.floor((time % 1000) / 100);
    // console.log(time, seconds, hundreds);

    return (
      <>
        <div className="w-min mt-1 text-left justify-self-end">{seconds}</div>
        <div className="w-3 mt-1 pt-px text-right text-base font-medium">
          {hundreds}
        </div>
      </>
    );
  };
  return (
    <div
      className="w-full h-12
            min-w-[6rem]
            sm:min-w-[8rem]  
            mx-auto
            px-4
            flex justify-center items-start
            border border-sky-900 rounded-md
            text-sky-900  
            bg-white
            cursor-default
            select-none"
    >
      {time ? formatTime() : " "}
    </div>
  );
};

export default Timer;
