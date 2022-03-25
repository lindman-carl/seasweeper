import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useQuery } from "react-query";

// components
import HighScoresContainer from "./HighscoreContainer";
import HighscoreList from "./HighscoreList";
import IconCheckbox from "../Game/IconCheckbox";
import HighscoreFilter from "./HighscoreFilter";
import { fetchHighscores } from "../Game/apiUtils";

//icons
import { GiTrophy } from "react-icons/gi";

const HighscoresApp = forwardRef(({ gamemodes }, ref) => {
  const [mapFilter, setMapFilter] = useState(gamemodes[0].name); // init on first gamemode
  const [searchFilter, setSearchFilter] = useState("");

  // fetch highscores on mount
  const {
    data: highscoreData,
    isLoading,
    error,
    refetch,
  } = useQuery("highscores", fetchHighscores, {
    refetchOnWindowFocus: false,
  });

  // export functions to parent
  useImperativeHandle(ref, () => ({
    refetchHighscores() {
      refetch();
    },
    setMapFilter(idx) {
      setMapFilter(idx);
    },
  }));

  // eventhandlers
  // handles map filter by selection of select input
  const handleMapFilter = ({ target }) => {
    setMapFilter(target.value);
  };

  const handleSearchFilter = ({ target }) => {
    setSearchFilter(target.value.trim());
  };

  // mapping gamemodes to select input
  const mapGamemodesToSelect = () =>
    gamemodes
      .sort((a, b) => a.name > b.name)
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
