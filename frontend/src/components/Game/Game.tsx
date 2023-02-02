import React, { useEffect } from "react";

// types
import { Board, Gamemode } from "../../types";

// utils
import { gamemodes, getGamemodeById } from "../../utils/gameUtils";
import { generateBoardsForAllGamemodes } from "../../utils/boardGeneration";

import { postHighscore } from "../../utils/apiUtils";

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
  setHighscoresMapFilter: (name: string) => void;
};

const Game = ({
  handleRefetchHighscores,
  setHighscoresMapFilter,
}: GameProps) => {
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
      // generates initial maps for gamemodes
      const newGamemodes = await generateBoardsForAllGamemodes(gamemodes);

      // get current gamemode
      const currentGamemode =
        newGamemodes.find((gm) => gm.id === gameState.currentGamemode.id) ||
        gamemodes[0];

      // set gamemodes, current gamemode, and board
      dispatch(setBoard(currentGamemode.board));
      dispatch(setCurrentGamemode(currentGamemode));
      dispatch(setAvailableLighthouses(currentGamemode.nLighthouses));
      dispatch(setGamemodes(newGamemodes));

      if (process.env.NODE_ENV === "development") {
        // setup the dev/test board
        dispatch(setBoard(testBoard));
      }
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

    // update highscore filtering to match the selected gamemode
    const newGamemodeName = getGamemodeById(gameState.gamemodes, id).name;
    setHighscoresMapFilter(newGamemodeName);
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
      <GamemodeCarousel handleSelectGamemode={handleSelectGamemode} />
      <Hud />
      <BoardComponent board={board} handleRetryGame={handleRetryGame} />
      <GameOverBox {...gameOverBoxProps} />
      <ScrollDownArrow />
    </GameContainer>
  );
};

export default Game;
