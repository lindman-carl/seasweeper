import { ClipLoader } from "react-spinners";
import HighscoreListHeaders from "./HighscoreListHeaders";
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

    // render list
    return filteredData.length > 0 ? (
      filteredData.map((highscore) => (
        <div
          key={highscore.rank}
          className="
            w-64 
            flex flex-row justify-start items-center
          text-sky-900"
        >
          <HighscoreListRow highscore={highscore} />
        </div>
      ))
    ) : (
      <div className="text-sm mt-4">No matching entries</div>
    );
  };

  return (
    <div className="w-96 flex flex-col items-center bg-sky-50 py-6 shadow-inner">
      <div
        className="
              w-80 max-h-80 
              overflow-scroll
              flex flex-col justify-start items-center"
      >
        {!error ? (
          isLoading ? (
            <div className="m-auto text-sky-800 h-12 flex items-center">
              <ClipLoader color="text-sky-800" />
            </div>
          ) : (
            <>
              <HighscoreListHeaders />
              {mapHighscores()}
            </>
          )
        ) : (
          <div className="m-auto text-sky-800 h-12 flex items-center">
            Error fetching highscores.
          </div>
        )}
      </div>
    </div>
  );
};

export default HighScores;
