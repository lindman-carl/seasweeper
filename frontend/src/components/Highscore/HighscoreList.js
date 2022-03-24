import { ClipLoader } from "react-spinners";
import HighscoreHeaders from "./HighscoreHeaders";
import HighscoreListRow from "./HighscoreListRow";

const HighScores = ({ data, isLoading, error, mapFilter, searchFilter }) => {
  /**
   * Maps data to HighscoreListRow objects
   * @returns Array of HigscoreListRow objects
   */
  const mapHighscores = () => {
    const filterHighscores = () => {
      const filteredByGamemode = data
        .filter((el) => el.gameMode === mapFilter)
        .map((el, idx) => ({ ...el, rank: idx }));

      console.log(filteredByGamemode);

      if (searchFilter) {
        return filteredByGamemode
          .filter(
            (el) =>
              el.playerName
                .toLowerCase()
                .trim()
                .includes(searchFilter.toLowerCase().trim()) && el
          )
          .sort((a, b) => a.time - b.time);
      }

      const ranked = filteredByGamemode.sort((a, b) => a.time - b.time);

      return ranked;
    };

    const filteredData = filterHighscores();
    return filteredData.length > 0 ? (
      filteredData.map((highscore) => (
        <div
          key={highscore.rank}
          className="
        w-48 sm:w-64 
        flex flex-row justify-start items-center
        text-sky-900"
        >
          {highscore.rank < 3 ? (
            <HighscoreListRow highscore={highscore} size={"xl"} />
          ) : (
            <HighscoreListRow highscore={highscore} size={"md"} />
          )}
        </div>
      ))
    ) : (
      <div className="text-sm mt-4">No matching entries</div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-sky-50 py-6 shadow-inner">
      {/* <HighscoreAppHeader /> */}
      <div
        className="
              w-96 max-h-72 min-h-min
              overflow-scroll
              flex flex-col justify-start items-center"
      >
        {!error ? (
          isLoading ? (
            <div className="m-auto text-sky-800">
              <ClipLoader color="text-sky-800" />
            </div>
          ) : (
            <>
              <HighscoreHeaders />
              {mapHighscores()}
            </>
          )
        ) : (
          <div className="m-auto text-sky-800">Error fetching highscores.</div>
        )}
      </div>
    </div>
  );
};

export default HighScores;
