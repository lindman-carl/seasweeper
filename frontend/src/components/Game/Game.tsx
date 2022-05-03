import React, { useEffect, useState, useRef } from "react";

// utils
import gameUtils from "./gameUtils";
import { generateValidMergedMap } from "./islandMapGenerator";

// types
import { Gamemode } from "../../types";
import { GameStateActionType } from "../../hooks/gameStateContext";

// components
import GamemodeCarousel from "./GamemodeCarousel";
import HighscoresApp from "../Highscore";
import GameBoard from "./GameBoard";
import { useGameState } from "../../hooks/gameStateContext";
import GameInfo from "./GameInfo";
import GeneratingMapSpinner from "./GeneratingMapSpinner";
// import TutorialCarousel from "./TutorialCarousel";

const generateBoard = async ({
  w,
  h,
  numBombs,
  nIslands,
  clusterSpread,
}: Gamemode) => {
  // generates a new board
  let tempBoard;

  if (nIslands > 0) {
    // generate map with islands
    const tempMap = await generateValidMergedMap(
      w,
      h,
      nIslands,
      clusterSpread,
      0.6
    );
    // populate map with bombs
    tempBoard = await gameUtils.populateGeneratedMap(numBombs, tempMap);
  } else {
    // generates map without islands
    tempBoard = gameUtils.populateBoard(w, h, numBombs);
  }
  return tempBoard;
};

const mapGamemodes = async (gamemodes: Gamemode[]): Promise<Gamemode[]> => {
  // generates maps for each gamemode asynchronously
  const mappedGamemodes = await Promise.all(
    gamemodes.map(async (gm) => {
      const newBoard = await generateBoard(gm);
      const mapped = { ...gm, board: newBoard };
      return mapped;
    })
  );
  return mappedGamemodes;
};

const regenerateSingleMappedGamemode = async (
  mappedGamemodes: Gamemode[],
  id: number
): Promise<Gamemode[]> => {
  // generates one new board by id
  const oldMappedGamemode = mappedGamemodes.find((gm) => gm.id === id);
  if (oldMappedGamemode) {
    const newBoard = await generateBoard(oldMappedGamemode);
    const newMappedGamemode = { ...oldMappedGamemode, board: newBoard };
    const newMappedGamemodes = [
      ...mappedGamemodes.filter((gm) => gm.id !== id),
      newMappedGamemode,
    ];

    return newMappedGamemodes.sort((a, b) => a.id - b.id);
  }

  // if failed
  return mappedGamemodes;
};

const GameApp = ({
  name,
  gamemodes,
}: {
  name: string;
  gamemodes: Gamemode[];
}) => {
  const { state, dispatch } = useGameState();
  // states
  // const [mappedGamemodes, setMappedGamemodes] = useState<any>();
  // const [currentGamemodeObject, setCurrentGamemodeObject] = useState<any>();

  // const [showGamemodeCarousel, setShowGamemodeCarousel] =
  //   useState<boolean>(false);

  // still necessary to force re-render
  const [randomKey, setRandomKey] = useState(
    Math.floor(Math.random() * 100000)
  );

  // refs
  const highscoresRef = useRef<any>();

  useEffect(() => {
    // generates initial maps for gamemodes
    const start = async () => {
      // generates maps for gamemodes
      const mapped = await mapGamemodes(gamemodes);

      // get ref to current gamemode
      const currentGamemode = mapped.find((gm) => gm.id === 0);

      // states
      dispatch({
        type: GameStateActionType.SET_MAPPED_GAMEMODES,
        payload: mapped,
      });
      dispatch({
        type: GameStateActionType.SET_CURRENT_GAMEMODE,
        payload: currentGamemode,
      });
    };

    start();

    // why if I only want on mount???
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get gamemode object by id
  const getGamemodeObject = (id: number) => {
    if (state.mappedGamemodes) {
      return state.mappedGamemodes.find((gm: Gamemode) => gm.id === id);
    }

    // if failure we are doomed
  };

  /**
   * Eventhandler for selecting gamemode by id
   * Also creates a new map for gamemode selection
   * @param {number} id
   */
  const handleSelectGamemode = async (id: number) => {
    const currentGamemode = getGamemodeObject(id);
    // generate a new map for the selected gamemode
    const newMappedGamemodes = await regenerateSingleMappedGamemode(
      state.mappedGamemodes,
      id
    );
    // update states
    dispatch({
      type: GameStateActionType.SET_CURRENT_GAMEMODE,
      payload: currentGamemode,
    });
    dispatch({
      type: GameStateActionType.SET_MAPPED_GAMEMODES,
      payload: newMappedGamemodes,
    });
    // update highscore filtering to match the selected gamemode
    highscoresRef.current.setMapFilter(currentGamemode.name);

    // closes carousel
    dispatch({
      type: GameStateActionType.SET_SHOW_GAMEMODE_CAROUSEL,
      payload: false,
    });
    setRandomKey(Math.floor(Math.random() * 100000)); // forces update, why i dont know, but it is needed
  };

  // toggles gamemode carousel show state
  const handleToggleGamemodeCarousel = () => {
    dispatch({
      type: GameStateActionType.SET_SHOW_GAMEMODE_CAROUSEL,
      payload: !state.showGamemodeCarousel,
    });
  };

  // calls highscoreApp refetch method
  const handleRefetchHighscores = () => {
    highscoresRef.current.refetchHighscores();
  };

  // props
  const gameBoardProps = {
    key: randomKey,
    handleToggleGamemodeCarousel,
    handleRefetchHighscores,
  };

  const gamemodeCarouselProps = {
    name,
    handleSelectGamemode,
    handleToggleGamemodeCarousel,
  };

  console.log(state.currentGamemode.board);
  // render
  return state.currentGamemode.board !== undefined ? (
    <div className="game-app-container">
      <GameBoard {...gameBoardProps}>
        {state.showGamemodeCarousel && (
          <GamemodeCarousel {...gamemodeCarouselProps} />
        )}
      </GameBoard>
      <GameInfo>
        <HighscoresApp gamemodes={state.gamemodes} ref={highscoresRef} />
      </GameInfo>
    </div>
  ) : (
    <GeneratingMapSpinner />
  );
};

export default GameApp;
