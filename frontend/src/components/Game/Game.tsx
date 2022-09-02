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

// context
import { useGameState } from "../../context/gameStateContext";
import { Types } from "../../context/gameStateReducer";
import GameContainer from "./GameContainer";
import { handleClickTile } from "../../logic/handleClickTile";

// const REFRESH_RATE = 100; // sets timer accuracy

type GameProps = {
  handleRefetchHighscores: () => void;
  setHighscoresMapFilter: (name: string) => void;
};

const Game = ({
  handleRefetchHighscores,
  setHighscoresMapFilter,
}: GameProps) => {
  // state
  const { state: gameState, dispatch } = useGameState();

  // useEffect
  useEffect(() => {
    const generateAllGamemodeBoards = async () => {
      // generates initial maps for gamemodes
      const newGamemodes = await generateBoardsForAllGamemodes(gamemodes);

      // get current gamemode
      const currentGamemode =
        newGamemodes.find((gm) => gm.id === gameState.currentGamemode.id) ||
        gamemodes[0];

      // update gamemodes and set board
      dispatch({
        type: Types.SET_BOARD,
        payload: { board: currentGamemode.board },
      });
      dispatch({
        type: Types.SET_GAMEMODES,
        payload: { gamemodes: newGamemodes },
      });
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
    dispatch({
      type: Types.GENERATE_NEW_BOARD,
      payload: { gamemode },
    });
    // reset game
    dispatch({ type: Types.RESET_GAME, payload: {} });
  };

  const handleRetryGame = (board: Board, gamemode: Gamemode) => {
    // reset game
    dispatch({ type: Types.RESET_GAME, payload: {} });

    // get new bombs
    dispatch({
      type: Types.REPOPULATE_BOARD,
      payload: {
        board,
        gamemode,
      },
    });
  };

  const handleSendHighscore = async ({ playerName }: any) => {
    // trigger loading animation
    dispatch({
      type: Types.SET_IS_SENDING_HIGHSCORE,
      payload: { isSendingHighscore: true },
    });

    await postHighscore(
      gameState.gameTime,
      playerName,
      gameState.currentGamemode.name
    );

    // untrigger loading animation
    dispatch({
      type: Types.SET_IS_SENDING_HIGHSCORE,
      payload: { isSendingHighscore: false },
    });

    // refetch highscore list
    handleRefetchHighscores();
  };

  const handleSelectGamemode = (id: number) => {
    // // sets current gamemode to id and generates a new board
    dispatch({ type: Types.SELECT_GAMEMODE, payload: { id } });
    // reset game
    dispatch({ type: Types.RESET_GAME, payload: {} });

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

  const gamemodeCarouselProps = {
    handleSelectGamemode,
  };

  // render loading spinner while generating maps
  if (!gameState.board) return <GeneratingMapSpinner />;

  // render
  return (
    <GameContainer>
      <GamemodeCarousel {...gamemodeCarouselProps} />
      <Hud />
      <button>
        <BoardComponent
          board={gameState.board}
          handleClickTile={handleClickTile}
          handleRetryGame={handleRetryGame}
        />
      </button>

      <GameOverBox {...gameOverBoxProps} />
      <ScrollDownArrow />
    </GameContainer>
  );
};

export default Game;
