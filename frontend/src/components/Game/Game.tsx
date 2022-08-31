import React, { useEffect, useState, useRef } from "react";

// utils
import gameUtils from "./gameUtils";
import { generateValidMergedMap } from "./islandMapGenerator";

// types
import { Gamemode } from "../../types";

// components
import Logo from "../Logo";
import GamemodeCarousel from "./GamemodeCarousel";
import HighscoresApp from "../Highscore";
import GameBoard from "./GameBoard";
import SignatureFooter from "../SignatureFooter";
import { MdOpenInNew } from "react-icons/md";
// import TutorialCarousel from "./TutorialCarousel";

const generateBoard = async ({
  w,
  h,
  numBombs,
  nIslands,
  clusterSpread,
  keepFromBorder,
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
      0.6,
      keepFromBorder
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
  // states
  const [mappedGamemodes, setMappedGamemodes] = useState<any>();
  const [currentGamemodeId, setCurrentGamemodeId] = useState<number>(0);
  const [currentGamemodeObject, setCurrentGamemodeObject] = useState<any>();

  const [showGamemodeCarousel, setShowGamemodeCarousel] =
    useState<boolean>(false);
  // const [showTutorial, setShowTutorial] = useState(false);

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
      const current = mapped.find((gm) => gm.id === currentGamemodeId);

      // states
      setMappedGamemodes(mapped);
      setCurrentGamemodeObject(current);
    };

    start();

    // why if I only want on mount???
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get gamemode objet by id
  const getGamemodeObject = (id: number) => {
    if (mappedGamemodes) {
      return mappedGamemodes.find((gm: Gamemode) => gm.id === id);
    }

    // if failure we are doomed
  };

  /**
   * Eventhandler for selecting gamemode by id
   * Also creates a new map for gamemode selection
   * @param {number} id
   */
  const handleSelectGamemode = async (id: number) => {
    const current = getGamemodeObject(id);
    // generate a new map for the selected gamemode
    const newMappedGamemodes = await regenerateSingleMappedGamemode(
      mappedGamemodes,
      id
    );
    // update states
    setCurrentGamemodeId(id);
    setCurrentGamemodeObject(current);
    setMappedGamemodes(newMappedGamemodes);
    // update highscore filtering to match the selected gamemode
    highscoresRef.current.setMapFilter(current.name);

    // closes carousel
    setShowGamemodeCarousel(false);
    setRandomKey(Math.floor(Math.random() * 100000)); // forces update, why i dont know, but it is needed
  };

  const regenerateGamemode = async (id: number) => {
    // generate a new map for the selected gamemode
    const newMappedGamemodes = await regenerateSingleMappedGamemode(
      mappedGamemodes,
      id
    );
    // update states
    setMappedGamemodes(newMappedGamemodes);
  };

  // toggles gamemode carousel show state
  const handleToggleGamemodeCarousel = () => {
    setShowGamemodeCarousel(!showGamemodeCarousel);
  };

  // calls highscoreApp refetch method
  const handleRefetchHighscores = () => {
    highscoresRef.current.refetchHighscores();
  };

  // props
  const gameBoardProps = {
    gamemodeObject: currentGamemodeObject,
    //handleRefetchHighscore,
    gamemodes,
    key: randomKey,
    showGamemodeCarousel,
    handleToggleGamemodeCarousel,
    handleRefetchHighscores,
  };

  const gamemodeCarouselProps = {
    name,
    mappedGamemodes,
    handleSelectGamemode,
    handleToggleGamemodeCarousel,
    showGamemodeCarousel,
    regenerateGamemode,
  };

  // render
  return currentGamemodeObject ? (
    <div className="game-app-container">
      <GameBoard {...gameBoardProps}>
        <>
          {showGamemodeCarousel && (
            <GamemodeCarousel {...gamemodeCarouselProps} />
          )}
          {/* {showTutorial && <TutorialCarousel {...gamemodeCarouselProps} />} */}
        </>
      </GameBoard>
      <div className="game-info-container">
        <Logo variant={"logo-large"} />

        <div className="lg:ml-3">
          <div className="game-text-container">
            Click to reveal tile. Flags are for slow players, try to mark the
            mines in your head. Place lighthouses on land to safely reveal
            adjacent water tiles.
            <a
              className="game-text-link"
              href="https://minesweepergame.com/strategy.php"
              target="_blank"
              rel="noreferrer"
              data-tip="Show tutorial"
              data-for="checkboxInfo"
            >
              How to play
              <MdOpenInNew />
            </a>
          </div>

          <HighscoresApp gamemodes={mappedGamemodes} ref={highscoresRef} />
        </div>
        <SignatureFooter />
      </div>
    </div>
  ) : null;
};

export default GameApp;
