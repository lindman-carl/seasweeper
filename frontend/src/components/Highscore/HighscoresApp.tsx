import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useQuery } from "react-query";

// types
import { Gamemode, HighscoreEntry } from "../../types";

// components
import HighScoresContainer from "./HighscoreContainer";
import HighscoreList from "./HighscoreList";
import HighscoreFilter from "./HighscoreFilter";
import IconCheckbox from "../Game/IconCheckbox";
import { fetchHighscores } from "../Game/apiUtils";

//icons
import { GiTrophy } from "react-icons/gi";

type Props = {
  gamemodes: [Gamemode];
};

const HighscoresApp = forwardRef(({ gamemodes }: Props, ref) => {
  const [mapFilter, setMapFilter] = useState<string>(gamemodes[0].name); // init on first gamemode
  const [searchFilter, setSearchFilter] = useState<string>("");

  // fetch highscores on mount
  const { data, isLoading, error, refetch } = useQuery(
    "highscores",
    fetchHighscores,
    {
      refetchOnWindowFocus: false,
    }
  );

  // handle undefined data
  const highscoreData: [HighscoreEntry] | [] = data ?? [];

  // export functions to parent
  useImperativeHandle(ref, () => ({
    refetchHighscores() {
      refetch();
    },
    setMapFilter(idx: string) {
      setMapFilter(idx);
    },
  }));

  // eventhandlers
  // handles map filter by selection of select input
  const handleMapFilter = ({
    currentTarget,
  }: React.ChangeEvent<HTMLSelectElement>) => {
    setMapFilter(currentTarget.value);
  };

  const handleSearchFilter = ({
    currentTarget,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(currentTarget.value.trim());
  };

  // mapping gamemodes to select input
  const mapGamemodesToSelect = () =>
    gamemodes
      .sort((a, b) => 0 - (a.name > b.name ? 1 : -1))
      .map((gm) => (
        <option value={gm.name} key={gm.id}>
          {gm.label}
        </option>
      ));

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
        />
      </div>
      {/* highscore filtering input */}
      <div className="highscores-input-container">
        <HighscoreFilter onChange={handleSearchFilter} />
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
        mapFilter={mapFilter}
        searchFilter={searchFilter}
      />
    </HighScoresContainer>
  );
});

export default HighscoresApp;
