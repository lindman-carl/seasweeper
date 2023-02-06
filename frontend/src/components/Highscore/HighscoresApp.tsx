import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { useQuery } from "react-query";

// types
import { Board, HighscoreEntry } from "../../types";

// utils
import { fetchDailyByDateString, fetchHighscores } from "../../utils/apiUtils";
import { gamemodes, getDateString, stringToMap } from "../../utils/gameUtils";
import { generateBoardFrom2DArray } from "../../utils/boardGeneration";
import { RootState } from "../../redux/store";
import { useAppSelector } from "../../redux/hooks";

// components
import HighScoresContainer from "./HighscoreContainer";
import HighscoreList from "./HighscoreList";
import HighscoreFilter from "./HighscoreFilter";
import HighscoreBoard from "./HighscoreBoard";
import IconCheckbox from "../Game/Hud/IconCheckbox";
import LeaderboardList from "./LeaderboardList";
import { DateFilter } from "./DateFilter";

//icons and spinners
import { GiTrophy } from "react-icons/gi";
import { FaMedal } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

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
  const [currentDailyBoard, setCurrentDailyBoard] = useState<Board | null>(
    null
  );
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);

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

  // fetch daily map on daily filter change
  useEffect(() => {
    const fetchDaily = async () => {
      const daily = await fetchDailyByDateString(dailyFilter);
      if (!daily) return;

      const dailyMap = stringToMap(daily.map, daily.width);

      const dailyBoard = generateBoardFrom2DArray(dailyMap, 0);
      setCurrentDailyBoard(dailyBoard);
    };
    fetchDaily();
  }, [dailyFilter]);

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
        Daily challenge
      </option>,
      ...optionTags,
    ];
  };

  if (showLeaderboard) {
    return (
      <HighScoresContainer>
        <div className="relative -top-4">
          <IconCheckbox
            icon={<FaMedal size={28} />}
            status={false}
            onClick={() => setShowLeaderboard(false)}
            tooltip={"View highscores"}
            iconColor={"#D6AF36"}
            id="view-highscores"
            ariaLabel="View highscores"
          />
        </div>
        <div className="leaderboard-header">Daily challenge champion</div>
        <LeaderboardList />
        <div className="bg-sky-50 text-xs text-sky-900 font-light text-center px-4 py-1">
          3 points for gold, 2 for silver, 1 for bronze. The leaderboard is
          updated every 24h, after the daily challenge has concluded.
        </div>
      </HighScoresContainer>
    );
  }

  return (
    <HighScoresContainer>
      {/* trophy icon/refresh */}
      <div className="relative -top-4">
        <IconCheckbox
          icon={<GiTrophy size={28} />}
          status={false}
          onClick={() => setShowLeaderboard(true)}
          tooltip={"View daily challenge leaderboard"}
          iconColor={"#D6AF36"}
          id="view-leaderboard"
          ariaLabel="View daily challenge leaderboard"
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
      {/* daily map */}
      {mapFilter === "daily" ? (
        currentDailyBoard ? (
          <HighscoreBoard board={currentDailyBoard} />
        ) : (
          <div className="h-8 m-auto mb-4 text-sky-800 flex items-center">
            <ClipLoader color="text-sky-800" />
          </div>
        )
      ) : null}
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
