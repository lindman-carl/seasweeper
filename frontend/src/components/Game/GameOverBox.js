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

const SendHighscoreForm = ({ handleSubmit, onSubmit, register }) => (
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="flex flex-col items-center"
  >
    <NameInput register={register} required />
    <div className="gameoverbox-item">
      <button type="submit" className="gameoverbox-button">
        Submit highscore
      </button>
    </div>
  </form>
);

const FormResponse = ({ isSendingHighscore }) => (
  <div className="gameoverbox-response">
    {isSendingHighscore ? <ClipLoader /> : <BsCheckCircle size={32} />}
  </div>
);

const RetryButton = ({ handleRestartGame }) => (
  <button className="gameoverbox-button" onClick={handleRestartGame}>
    Retry
  </button>
);

const GameOverBox = ({
  gameTime,
  win,
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

  const renderForm = () =>
    !hasSubmit ? (
      <SendHighscoreForm
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        register={register}
      />
    ) : (
      <FormResponse isSendingHighscore={isSendingHighscore} />
    );

  const gameoverMode = () =>
    win ? (
      <>
        <div className="gameoverbox-header font-bold">
          {(gameTime / 1000).toFixed(2)}s
        </div>

        {renderForm()}
      </>
    ) : (
      <div className="gameoverbox-item">
        <div className="gameoverbox-header font-semibold">
          Failure achieved in {(gameTime / 1000).toFixed(2)}s
        </div>
      </div>
    );

  return (
    <div className="gameoverbox-container">
      {gameoverMode()}

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
