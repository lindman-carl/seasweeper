import { useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";

const NameInput = ({ register, required }) => (
  <input
    autoFocus
    placeholder="Player name"
    className="
          mb-2 
          border-b-2 
          bg-slate-100 
          font-semibold text-center text-lg 
          focus:outline-none"
    {...register("playerName", { required })}
  />
);

const RetryButton = ({ handleRestartGame }) => (
  <button className="gameoverbox-button" onClick={handleRestartGame}>
    Retry
  </button>
);

const GameOverBox = ({
  gameTime,
  playerName,
  win,
  handlePlayerNameChange,
  handleSendHighscore,
  isSendingHighscore,
  handleRestartGame,
}) => {
  const { register, handleSubmit } = useForm();
  const [hasSubmit, setHasSubmit] = useState(false);

  const onSubmit = (data) => {
    handleSendHighscore(data);
    setHasSubmit(true);
  };

  return (
    <div className="gameoverbox-container">
      {win ? (
        <>
          <div className="mb-2 mt-2 text-2xl font-bold">
            {(gameTime / 1000).toFixed(2)}s
          </div>

          {!hasSubmit ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center"
            >
              <NameInput
                playerName={playerName}
                handlePlayerNameChange={handlePlayerNameChange}
                register={register}
                required
              />
              <div className="gameoverbox-item">
                <button type="submit" className="gameoverbox-button">
                  Submit highscore
                </button>
              </div>
            </form>
          ) : (
            <div className="gameoverbox-response">
              {isSendingHighscore ? (
                <ClipLoader />
              ) : (
                <BsCheckCircle size={32} />
              )}
            </div>
          )}
        </>
      ) : (
        <div className="gameoverbox-item">
          <div className="gameoverbox-header font-semibold">
            Failure achieved in {(gameTime / 1000).toFixed(2)}s
          </div>
        </div>
      )}

      <div className="gameoverbox-item">
        <RetryButton handleRestartGame={handleRestartGame} />
      </div>

      <div className="gameoverbox-item">
        <Link to="/highscores">View highscores</Link>
      </div>
    </div>
  );
};

export default GameOverBox;
