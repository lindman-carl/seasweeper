import React, { useState } from "react";
import { useForm } from "react-hook-form";

// icons and spinners
import { BsCheckCircle } from "react-icons/bs";
import { ClipLoader } from "react-spinners";

// components
import SendHighscoreForm from "./SendHighscoreForm";
import GameOverBoxButton from "./GameOverBoxButton";

// types
import { Board, Gamemode } from "../../../types";
import { formatTime } from "../../../utils/gameUtils";

// Redux
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";

type FormResponseProps = {
  isSendingHighscore: boolean;
};

const FormResponse = ({ isSendingHighscore }: FormResponseProps) => (
  // displays ClipLoader until server response
  // then display checkmark, it doesn't matter if it was succesful or not.
  // for some reason coloring does not work with only tailwind text-sky-800
  // nor only prop color="text-sky-800", but with both it does, and then it is from tailwind
  <div className="gameoverbox-item text-sky-800">
    {isSendingHighscore ? (
      <ClipLoader color="text-sky-800" />
    ) : (
      <BsCheckCircle size={32} />
    )}
  </div>
);

type GameOverBoxProps = {
  handleSendHighscore: (data: string) => void;
  handleNewGame: (gamemode: Gamemode) => void;
  handleRetryGame: (board: Board, gamemode: Gamemode) => void;
  handleRefetchHighscores: () => void;
};

const GameOverBox = ({
  handleSendHighscore,
  handleNewGame,
  handleRetryGame,
  handleRefetchHighscores,
}: GameOverBoxProps) => {
  const { gameOver, gameWin, gameTime, isSendingHighscore, currentGamemode } =
    useAppSelector((state: RootState) => state.gameState);
  const board = useAppSelector((state: RootState) => state.board);

  // react-hook-form
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ reValidateMode: "onSubmit" });

  const [hasSubmit, setHasSubmit] = useState(false);

  // whether to display the Generate New Map button
  const generateNewMapAvailable = currentGamemode.nIslands > 0;

  const onSubmit = (data: string) => {
    handleSendHighscore(data);
    setHasSubmit(true);
    handleRefetchHighscores();
  };

  const renderForm = () =>
    // displays submit form if user has not submit yet
    // otherwise display FormResponse
    !hasSubmit ? (
      <>
        <SendHighscoreForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          register={register}
          errors={errors}
        />
      </>
    ) : (
      <FormResponse isSendingHighscore={isSendingHighscore} />
    );

  const displayForm = () =>
    // display submit form if win, else lose statement
    gameWin ? (
      <>
        <div className="gameoverbox-item gameoverbox-header">
          {formatTime(gameTime)}s
        </div>

        {renderForm()}
      </>
    ) : (
      <div className="gameoverbox-item gameoverbox-header">
        Failure achieved in {formatTime(gameTime)}s
      </div>
    );

  // only render when gameOver
  if (!gameOver) return null;

  // render
  return (
    <div className="gameoverbox-container">
      {/* show submit form if win */}
      {displayForm()}

      <GameOverBoxButton
        label="Retry Map"
        onClick={() => handleRetryGame(board, currentGamemode)}
      />

      {/* displays Generate New Map button if islands map */}
      {generateNewMapAvailable && (
        <GameOverBoxButton
          label="Generate New Map"
          textColor="text-green-600"
          borderColor="border-green-700"
          onClick={() => handleNewGame(currentGamemode)}
        />
      )}

      {/* view highscore scroll to link on smaller screens */}
      <div className="gameoverbox-item h-12 lg:h-4">
        <button
          onClick={() =>
            window.scrollTo({
              top: 1000,
              behavior: "smooth",
            })
          }
          className="lg:hidden text-sky-800"
        >
          View highscores
        </button>
      </div>
    </div>
  );
};

export default GameOverBox;
