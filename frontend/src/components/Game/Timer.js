const Timer = ({ time }) => {
  const formatTime = () => {
    const seconds = Math.floor(time / 1000);
    const hundreds = Math.floor((time % 1000) / 100);
    console.log(time, seconds, hundreds);

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
      className="min-w-[6rem] w-full h-12 
            mx-4
            flex justify-center items-start
            border-2 border-sky-900 rounded-md
            text-sky-900  
            bg-white
            cursor-default
            select-none"
    >
      {time ? formatTime() : "lol"}
    </div>
  );
};

export default Timer;
