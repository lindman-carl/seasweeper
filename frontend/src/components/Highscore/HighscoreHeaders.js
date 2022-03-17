const HighscoreHeaders = () => {
  return (
    <div className="w-96 flex flex-row justify-start items-center">
      <div className="w-4 mr-8 text-md">Rank</div>
      <div className="text-md grow">Name</div>
      <div className="w-16 text-md">Time (s)</div>
    </div>
  );
};

export default HighscoreHeaders;
