import React from "react";

import GameOverBoxButton from "./GameOverBoxButton";
import TextInput from "./TextInput";

type Props = {
  handleSubmit: any;
  onSubmit: any;
  register: any;
  errors: any;
};

const SendHighscoreForm = ({
  handleSubmit,
  onSubmit,
  register,
  errors,
}: Props) => (
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
    <div className="font-light text-sm text-red-600">
      {errors.playerName?.type === "required" &&
        "Player name is required to submit highscore"}
      {errors.playerName?.type === "minLength" &&
        "Player name length must be longer than 2 characters"}
      {errors.playerName?.type === "maxLength" &&
        "Player name length must be shorter than 21 characters"}
    </div>
    <GameOverBoxButton
      label={"Submit highscore"}
      type="submit"
      id={"submit-highscore-button"}
    />
  </form>
);

export default SendHighscoreForm;
