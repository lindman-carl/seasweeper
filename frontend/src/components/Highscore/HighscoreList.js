import { ClipLoader } from "react-spinners";
import HighscoreHeaders from "./HighscoreHeaders";
import HighscoreListRow from "./HighscoreListRow";

const HighscoreAppHeader = () => (
  <div className="m-4 font-bold text-2xl">Highscores</div>
);

const HighScores = ({ data, isLoading, error, filter, inGame }) => {
  /**
   * Maps data to HighscoreListRow objects
   * @returns Array of HigscoreListRow objects
   */
  const mapHighscores = () => {
    const filteredData = data.filter((e) => e.gameMode === filter);
    const slicedData = inGame ? filteredData.slice(0, 10) : filteredData;
    return slicedData.map((highscore, idx) => (
      <div
        key={idx}
        className="
        w-48 sm:w-64 
        flex flex-row justify-start items-center"
      >
        {idx < 3 ? (
          <HighscoreListRow highscore={highscore} rank={idx} size={"xl"} />
        ) : (
          <HighscoreListRow highscore={highscore} rank={idx} size={"md"} />
        )}
      </div>
    ));
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      <HighscoreAppHeader />
      <div
        className="
              w-96 h-full max-h-96
              overflow-scroll
              flex flex-col justify-start items-center"
      >
        {!error ? (
          isLoading ? (
            <div className="mt-16">
              <ClipLoader />
            </div>
          ) : (
            <>
              <HighscoreHeaders />
              {mapHighscores()}
            </>
          )
        ) : (
          <div className="my-16">Error fetching highscores.</div>
        )}
      </div>
    </div>
  );
};

export default HighScores;
