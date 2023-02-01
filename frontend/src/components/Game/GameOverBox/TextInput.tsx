import React from "react";

type Props = {
  placeholder: string;
  registerName: string;
  register: any;
  required: boolean;
  minLength: number;
  maxLength: number;
};

const TextInput = ({
  placeholder,
  registerName,
  register,
  required,
  minLength,
  maxLength,
}: Props) => (
  <input
    autoFocus
    placeholder={placeholder}
    className="text-input"
    {...register(registerName, {
      required,
      minLength,
      maxLength,
      validate: (value: string) => {
        return !!value.trim();
      },
    })}
    defaultValue={localStorage.getItem("playerName") || ""}
    id="player-name-input"
  />
);

export default TextInput;
