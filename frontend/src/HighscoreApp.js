import axios from "axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

import HighscoreList from "./components/Highscore/HighscoreList";

const fetchHighscores = async () => {
  const res = await axios.get("http://localhost:3001/api/highscores");
  const sortedData = res.data.sort((a, b) => a.time - b.time);

  return sortedData;
};

const HighscoreApp = (props) => {
  const {
    data: highscoreData,
    isLoading,
    error,
  } = useQuery("highscores", fetchHighscores, {
    refetchOnWindowFocus: false,
  });

  if (error) {
    console.log(error);
    return <div>error</div>;
  }

  return (
    <div
      className="w-full h-full 
                flex flex-col items-center"
    >
      <Link to="/" className="mt-2">
        Back to game
      </Link>
      <HighscoreList isLoading={isLoading} data={highscoreData} />
    </div>
  );
};

export default HighscoreApp;
