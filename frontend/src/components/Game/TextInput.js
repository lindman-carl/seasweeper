const TextInput = ({
  placeholder,
  registerName,
  register,
  required,
  minLength,
  maxLength,
}) => (
  <input
    autoFocus
    placeholder={placeholder}
    className="
          mb-2 
          border-b-2 
          bg-white
          text-sky-900
          font-semibold text-center text-lg 
          focus:outline"
    {...register(registerName, {
      required,
      minLength,
      maxLength,
      validate: (value) => {
        return !!value.trim();
      },
    })}
    defaultValue={localStorage.getItem("playerName") || ""}
  />
);

export default TextInput;
