import TextInput from "./TextInput";

const SendHighscoreForm = ({ handleSubmit, onSubmit, register }) => (
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="flex flex-col items-center"
  >
    <TextInput
      placeholder={"p-name"}
      registerName={"playerName"}
      register={register}
      required
    />
    <div className="gameoverbox-item">
      <button type="submit" className="gameoverbox-button">
        Submit highscore
      </button>
    </div>
  </form>
);

export default SendHighscoreForm;
