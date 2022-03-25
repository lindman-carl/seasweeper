import GameOverBoxButton from "./GameOverBoxButton";
import TextInput from "./TextInput";

const SendHighscoreForm = ({ handleSubmit, onSubmit, register, errors }) => (
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="flex flex-col items-center"
  >
    <TextInput
      placeholder={"Player name"}
      registerName={"playerName"}
      register={register}
      required
      minLength={3}
      maxLength={20}
    />
    <div className="font-thin text-red-400 text-sm">
      {errors.playerName?.type === "required" &&
        "Player name is required to submit highscore"}
      {errors.playerName?.type === "minLength" &&
        "Player name length must be longer than 2 characters"}
      {errors.playerName?.type === "maxLength" &&
        "Player name length must be shorter than 21 characters"}
    </div>
    {/* <div className="gameoverbox-item">
      <button type="submit" className="gameoverbox-button">
        Submit highscore
      </button>
    </div> */}
    <GameOverBoxButton label={"Submit highscore"} type="submit" />
  </form>
);

export default SendHighscoreForm;
