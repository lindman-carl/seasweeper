import HighScoresContainer from "../Highscore/HighscoreContainer";
import HighscoreList from "../Highscore/HighscoreList";
import IconCheckbox from "./IconCheckbox";
import { GiTrophy } from "react-icons/gi";
import HighscoreFilter from "../Highscore/HighscoreFilter";

const HighscoresApp = ({
  handleRefetchHighscore,
  handleSearchFilter,
  handleMapFilter,
  currentMapFilter,
  gamemodes,
  highscoreData,
  isLoading,
  error,
  currentSearchFilter,
}) => {
  return (
    <HighScoresContainer>
      <div className="relative -top-4">
        <IconCheckbox
          icon={<GiTrophy size={28} />}
          status={false}
          onClick={handleRefetchHighscore}
          tooltip={"Refresh highscores"}
          iconColor={"#D6AF36"}
        />
      </div>
      <div className="flex flex-row items-center mb-4 ">
        <HighscoreFilter onChange={handleSearchFilter} />
        <select
          className="highscores-select"
          onChange={handleMapFilter}
          value={currentMapFilter}
        >
          {gamemodes
            .sort((a, b) => a.name > b.name)
            .map((gm) => (
              <option value={gm.name} key={gm.id}>
                {gm.label}
              </option>
            ))}
        </select>
      </div>
      <HighscoreList
        data={highscoreData}
        isLoading={isLoading}
        error={error}
        mapFilter={currentMapFilter}
        searchFilter={currentSearchFilter}
        inGame={false}
      />
    </HighScoresContainer>
  );
};

export default HighscoresApp;
