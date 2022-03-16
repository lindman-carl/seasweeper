const HighScoreRow = ({ highscore: { playerName, time }, rank, size }) => {
  return (
    <>
      <div className={`w-4 mr-8 text-${size}`}>{rank + 1}.</div>
      <div className={`text-${size} grow`}>{playerName}</div>
      <div className={`w-16 text-${size} text-left`}>
        {(time / 1000).toFixed(2)}
      </div>
    </>
  );
};

export default HighScoreRow;
