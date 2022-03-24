const HighscoreHeaders = () => {
  return (
    <div className="w-48 sm:w-64 mb-1 flex flex-row justify-start items-center">
      <div className="w-4 mr-8 text-md">Rank</div>
      <div className="text-md ml-1 grow">Name</div>
      <div className="w-16 text-md">Time (s)</div>
    </div>
  );
};

export default HighscoreHeaders;
