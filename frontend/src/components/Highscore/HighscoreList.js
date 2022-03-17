import { ClipLoader } from "react-spinners";
import HighscoreHeaders from "./HighscoreHeaders";
import HighscoreListRow from "./HighscoreListRow";

const HighscoreAppHeader = () => (
  <div className="m-4 font-bold text-2xl">Highscores</div>
);

const HighScores = ({ data, isLoading }) => {
  /**
   * Maps data to HighscoreListRow objects
   * @returns Array of HigscoreListRow objects
   */
  const mapHighscores = () => {
    return data.map((highscore, idx) => (
      <div key={idx} className="w-96 flex flex-row justify-start items-center">
        {idx < 3 ? (
          <HighscoreListRow highscore={highscore} rank={idx} size={"2xl"} />
        ) : (
          <HighscoreListRow highscore={highscore} rank={idx} size={"lg"} />
        )}
      </div>
    ));
  };

  return (
    <div
      className="w-full h-full 
        flex flex-col justify-start items-center"
    >
      <HighscoreAppHeader />
      {isLoading ? (
        <div className="mt-16">
          <ClipLoader />
        </div>
      ) : (
        <>
          <HighscoreHeaders />
          {mapHighscores()}
        </>
      )}
    </div>
  );
};

export default HighScores;
