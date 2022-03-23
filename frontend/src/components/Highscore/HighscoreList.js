import { ClipLoader } from "react-spinners";
import HighscoreHeaders from "./HighscoreHeaders";
import HighscoreListRow from "./HighscoreListRow";

const HighscoreAppHeader = () => (
  <div className="m-4 font-bold text-2xl">Highscores</div>
);

const HighScores = ({ data, isLoading, error, mapFilter, searchFilter }) => {
  /**
   * Maps data to HighscoreListRow objects
   * @returns Array of HigscoreListRow objects
   */
  const mapHighscores = () => {
    const filterHighscores = () => {
      const filteredByGamemode = data.filter((el) => el.gameMode === mapFilter);
      console.log(filteredByGamemode);

      if (searchFilter) {
        return filteredByGamemode
          .filter(
            (el) =>
              el.name
                .toLowerCase()
                .trim()
                .includes(searchFilter.toLowerCase().trim()) && el
          )
          .sort((a, b) => a.time - b.time);
      }

      return filteredByGamemode.sort((a, b) => a.time - b.time);
    };

    const filteredData = filterHighscores();
    return filteredData.map((highscore, idx) => (
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
    <div className="w-full h-full flex flex-col justify-start items-center bg-sky-50 py-6 ">
      {/* <HighscoreAppHeader /> */}
      <div
        className="
              w-96 h-full max-h-96
              overflow-scroll
              flex flex-col justify-start items-center"
      >
        {!error ? (
          isLoading ? (
            <div className="m-auto">
              <ClipLoader />
            </div>
          ) : (
            <>
              <HighscoreHeaders />
              {mapHighscores()}
            </>
          )
        ) : (
          <div className="m-auto">Error fetching highscores.</div>
        )}
      </div>
    </div>
  );
};

export default HighScores;
