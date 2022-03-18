import { useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

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
  <button
    className="
          w-48
          m-1 p-1 pl-2 pr-2 mt-2 
          border-2 border-dashed rounded 
          font-semibold 
          bg-gray-300 
          hover:border-4 hover:border-slate-500 hover:rounded-lg hover:shadow-lg 
          active:scale-90 active:rounded-xl active:shadow-sm
          cursor-pointer 
          transition-all duration-75"
    onClick={handleRestartGame}
  >
    Retry
  </button>
);

const GameOverBox = ({
  gameTime,
  playerName,
  win,
  handlePlayerNameChange,
  handleSendHighscore,
  handleRestartGame,
}) => {
  const { register, handleSubmit } = useForm();
  const [hasSubmit, setHasSubmit] = useState(false);

  const onSubmit = (data) => {
    handleSendHighscore(data);
    setHasSubmit(true);
  };

  return (
    <div
      className="
            w-5/6 h-min
            w-96
            max-w-[24rem]
            sm:w-96
            z-10 top-1/3 absolute 
            flex flex-col justify-center items-center
            border-2 border-dashed rounded-md 
            bg-slate-100 
            shadow-lg"
    >
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
              <button
                type="submit"
                className="
                      w-48
                      m-1 p-1 pl-2 pr-2 mt-2 
                      flex flex-row justify-center items-center
                      border-2 border-dashed rounded 
                      bg-gray-300 
                      font-semibold 
                      hover:border-4 hover:border-slate-500 hover:rounded-lg hover:shadow-lg 
                      active:scale-90 active:rounded-xl active:shadow-sm
                      cursor-pointer 
                      transition-all duration-75"
              >
                Submit highscore
              </button>
            </form>
          ) : (
            <BsCheckCircle size={32} className="m-2" />
          )}
        </>
      ) : (
        <div className="gameoverbox-item">
          <div className="mb-2 mt-2 text-2xl font-semibold">
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
