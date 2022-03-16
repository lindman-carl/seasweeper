const Timer = ({ time }) => {
  const formatTime = time / 1000;
  return <div className="">{formatTime.toFixed(2)}</div>;
};

export default Timer;
