const TextInput = ({ placeholder, registerName, register, required }) => (
  <input
    autoFocus
    placeholder={placeholder}
    className="
          mb-2 
          border-b-2 
          bg-slate-100 
          font-semibold text-center text-lg 
          focus:outline-none"
    {...register(registerName, { required })}
  />
);

export default TextInput;
