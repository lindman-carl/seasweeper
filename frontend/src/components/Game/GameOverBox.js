import { useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";

// components
import SendHighscoreForm from "./SendHighscoreForm";

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
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ reValidateMode: "onSubmit" });
  const [hasSubmit, setHasSubmit] = useState(false);

  const onSubmit = (data) => {
    handleSendHighscore(data);
    setHasSubmit(true);
  };

  const renderForm = () =>
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
