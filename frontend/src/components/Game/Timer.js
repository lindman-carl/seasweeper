const Timer = ({ time }) => {
  const formatTime = time / 1000;
  return <div className="">{formatTime.toFixed(1)}</div>;
};

export default Timer;
