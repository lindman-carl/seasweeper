import React, { useEffect } from "react";

// types
import { Board, Gamemode } from "../../types";

// utils
import { gamemodes, getGamemodeById, stringToMap } from "../../utils/gameUtils";
import {
  generateBoardFrom2DArray,
  generateBoardsForAllGamemodes,
} from "../../utils/boardGeneration";

import { fetchDaily, postHighscore } from "../../utils/apiUtils";

// components
import BoardComponent from "./BoardComponent";
import GamemodeCarousel from "./GamemodeCarousel";
import GameOverBox from "./GameOverBox";
import GeneratingMapSpinner from "./GeneratingMapSpinner";
import Hud from "./Hud";
import ScrollDownArrow from "./ScrollDownArrow";
import GameContainer from "./GameContainer";

// redux
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { RootState } from "../../redux/store";
import { boardActions, gameStateActions } from "../../redux/gameStateSlice";

// const REFRESH_RATE = 100; // sets timer accuracy

// test board
import testData from "../../utils/test-board.json";
const testBoard = testData as Board;

type GameProps = {
  handleRefetchHighscores: () => void;
};

const Game = ({ handleRefetchHighscores }: GameProps) => {
  // state
  const gameState = useAppSelector((state: RootState) => state.gameState);
  const board = useAppSelector((state: RootState) => state.board);

  const dispatch = useAppDispatch();

  const {
    setGamemodes,
    setCurrentGamemode,
    resetGame,
    setIsSendingHighscore,
    selectGamemode,
    setAvailableLighthouses,
  } = gameStateActions;

  const { setBoard, generateNewBoard, repopulateBoard } = boardActions;

  // useEffect
  useEffect(() => {
    const generateAllGamemodeBoards = async () => {
      let newGamemodes: Gamemode[] = [];
      try {
        // fetch daily gamemode
        const daily = await fetchDaily();
        const dailyMap = stringToMap(daily.map, daily.width);
        const dailyBoard = generateBoardFrom2DArray(dailyMap, daily.numBombs);
        const dailyGamemode: Gamemode = {
          id: 0,
          name: `${daily.dateString}`,
          label: `Daily challenge`,
          link: "/daily",
          width: daily.width,
          height: daily.height,
          board: dailyBoard,
          nLighthouses: daily.nLighthouses,
          numBombs: daily.numBombs,
          clusterSpread: -1,
          nIslands: -1,
          keepFromBorder: false,
        };
        newGamemodes = [dailyGamemode, ...newGamemodes];
      } catch (err) {
        console.error(err);
      }

      // generates initial maps for gamemodes
      const generatedGamemodes = await generateBoardsForAllGamemodes(gamemodes);
      newGamemodes = [...newGamemodes, ...generatedGamemodes];

      // get current gamemode
      const currentGamemode =
        newGamemodes.find((gm) => gm.id === 0) || newGamemodes[0];

      // set gamemodes, current gamemode, and board
      dispatch(setBoard(currentGamemode.board));
      dispatch(setCurrentGamemode(currentGamemode));
      dispatch(setAvailableLighthouses(currentGamemode.nLighthouses));
      dispatch(setGamemodes(newGamemodes));

      // if (process.env.NODE_ENV === "development") {
      //   // setup the dev/test board
      //   dispatch(setBoard(testBoard));
      // }
    };

    generateAllGamemodeBoards();

    // clear interval on unmount
    return () => {
      clearInterval(gameState.intervalId);
    };

    // what if i only want on mount?
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // generate new map and restart game
  const handleNewGame = (gamemode: Gamemode) => {
    // generate a new board,
    // and reset game
    dispatch(generateNewBoard(gamemode));
    // reset game
    dispatch(resetGame());
  };

  const handleRetryGame = (board: Board, gamemode: Gamemode) => {
    // reset game
    dispatch(resetGame());

    // get new bombs
    dispatch(repopulateBoard(gameState.currentGamemode));
  };

  const handleSendHighscore = async ({ playerName }: any) => {
    // trigger loading animation
    dispatch(setIsSendingHighscore(true));

    await postHighscore(
      gameState.gameTime,
      playerName,
      gameState.currentGamemode.name
    );

    // end loading animation
    dispatch(setIsSendingHighscore(false));

    // refetch highscore list
    handleRefetchHighscores();
  };

  const handleSelectGamemode = (id: number) => {
    // // sets current gamemode to id and generates a new board
    const newGamemode = getGamemodeById(gameState.gamemodes, id);
    dispatch(selectGamemode(id));
    dispatch(setBoard(newGamemode.board));

    // reset game
    dispatch(resetGame());
  };

  // props
  const gameOverBoxProps = {
    handleSendHighscore,
    handleRefetchHighscores,
    handleNewGame,
    handleRetryGame,
  };

  // render loading spinner while generating maps
  if (!board) return <GeneratingMapSpinner />;

  // render
  return (
    <GameContainer>
      <GamemodeCarousel
        handleSelectGamemode={handleSelectGamemode}
        startGamemode={gameState.currentGamemode}
      />
      <Hud />
      <BoardComponent board={board} handleRetryGame={handleRetryGame} />
      <GameOverBox {...gameOverBoxProps} />
      <ScrollDownArrow />
    </GameContainer>
  );
};

export default Game;
