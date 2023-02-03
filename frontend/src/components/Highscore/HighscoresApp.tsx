import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { useQuery } from "react-query";

// types
import { HighscoreEntry } from "../../types";

// utils
import { fetchHighscores } from "../../utils/apiUtils";
import { gamemodes, getDateString } from "../../utils/gameUtils";
import { RootState } from "../../redux/store";

// components
import HighScoresContainer from "./HighscoreContainer";
import HighscoreList from "./HighscoreList";
import HighscoreFilter from "./HighscoreFilter";
import IconCheckbox from "../Game/Hud/IconCheckbox";

//icons
import { GiTrophy } from "react-icons/gi";
import { useAppSelector } from "../../redux/hooks";
import { DateFilter } from "./DateFilter";

const dateString = getDateString(new Date());

const HighscoresApp = forwardRef((_, ref) => {
  // game state
  const { currentGamemode } = useAppSelector(
    (state: RootState) => state.gameState
  );

  const sortedGamemodes = [...gamemodes].sort((a, z) => a.id - z.id);
  const [mapFilter, setMapFilter] = useState<string>(currentGamemode.name); // init on current gamemode
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [dailyFilter, setDailyFilter] = useState<string>(dateString); // init on current date

  // fetch highscores on mount
  const { data, isLoading, error, refetch } = useQuery(
    "highscores",
    fetchHighscores,
    {
      refetchOnWindowFocus: false,
    }
  );

  // handle undefined data
  const highscoreData: HighscoreEntry[] = data ?? [];

  // "export functions to parent"
  useImperativeHandle(ref, () => ({
    refetchHighscores() {
      refetch();
    },
  }));

  // set map filter on gamemode change
  useEffect(() => {
    if (currentGamemode.id === 0) {
      setMapFilter("daily");
      return;
    }
    setMapFilter(currentGamemode.name);
  }, [currentGamemode]);

  // eventhandlers
  // handles map filter by selection of select input
  const handleMapFilter = ({
    currentTarget,
  }: React.ChangeEvent<HTMLSelectElement>) => {
    if (currentTarget.value === "daily") {
      setMapFilter("daily");
      return;
    }
    setMapFilter(currentTarget.value);
  };

  const handleSearchFilter = ({
    currentTarget,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(currentTarget.value.trim());
  };

  const handleDailyFilter = ({
    currentTarget,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setDailyFilter(currentTarget.value);
  };

  // mapping gamemodes to select input
  const mapGamemodesToSelect = () => {
    const optionTags = sortedGamemodes
      .sort((a, b) => 0 - (a.name > b.name ? 1 : -1))
      .map((gm) => (
        <option value={gm.name} key={gm.id}>
          {gm.label}
        </option>
      ));

    // hard code daily option first
    return [
      <option value={"daily"} key={0}>
        Daily
      </option>,
      ...optionTags,
    ];
  };
  return (
    <HighScoresContainer>
      {/* trophy icon/refresh */}
      <div className="relative -top-4">
        <IconCheckbox
          icon={<GiTrophy size={28} />}
          status={false}
          onClick={refetch}
          tooltip={"Refresh highscores"}
          iconColor={"#D6AF36"}
          id="refresh-highscores"
          ariaLabel="Refresh highscores"
        />
      </div>
      {/* highscore filtering input */}
      <div className="highscores-input-container">
        {mapFilter === "daily" ? (
          <DateFilter
            handleDailyFilter={handleDailyFilter}
            value={dailyFilter}
          />
        ) : (
          <HighscoreFilter onChange={handleSearchFilter} />
        )}
        <select
          className="highscores-select"
          onChange={handleMapFilter}
          value={mapFilter}
        >
          {mapGamemodesToSelect()}
        </select>
      </div>
      {/* map highscores */}
      <HighscoreList
        data={highscoreData}
        isLoading={isLoading}
        error={error}
        mapFilter={mapFilter === "daily" ? dailyFilter : mapFilter}
        searchFilter={searchFilter}
      />
    </HighScoresContainer>
  );
});

export default HighscoresApp;
