import { useQuery } from "react-query";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import axios from "axios";

import HighScoreRow from "./HighScoreRow";

const fetchHighscores = async () => {
  const res = await axios.get("http://localhost:3001/api/highscores");
  const sortedData = res.data.sort((a, b) => a.time - b.time);
  console.log(sortedData);

  // get top 10
  const topTenData = sortedData.slice(0, 10);
  return topTenData;
};

const HighscoreHeaders = () => {
  return (
    <div className="w-96 flex flex-row justify-start items-center">
      <div className="w-4 mr-8 text-md">Rank</div>
      <div className="text-md grow">Name</div>
      <div className="w-16 text-md">Time (s)</div>
    </div>
  );
};

const HighScores = (props) => {
  const { data, isLoading, error } = useQuery("highscores", fetchHighscores, {
    refetchOnWindowFocus: false,
  });

  if (error) {
    console.log(error);
    return <div>error</div>;
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <ClipLoader color={"gray"} loading={isLoading} size={32} />
      </div>
    );
  }

  const mapHighscores = () => {
    return data.map((highscore, idx) => (
      <div key={idx} className="w-96 flex flex-row justify-start items-center">
        {idx < 3 ? (
          <HighScoreRow highscore={highscore} rank={idx} size={"2xl"} />
        ) : (
          <HighScoreRow highscore={highscore} rank={idx} size={"lg"} />
        )}
      </div>
    ));
  };

  return (
    <div
      className="w-screen h-screen 
        flex flex-col justify-start items-center"
    >
      <Link to="/">Back to game</Link>
      <div className="m-4 font-bold text-2xl">Highscores</div>
      <div
        className="w-screen h-screen
          flex flex-col justify-start items-center"
      >
        <HighscoreHeaders />
        {mapHighscores()}
      </div>
    </div>
  );
};

export default HighScores;
