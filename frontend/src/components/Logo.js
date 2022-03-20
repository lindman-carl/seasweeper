import { GiBroom } from "react-icons/gi";

const Logo = ({ size }) => {
  if (size === "sm") {
    return (
      <div
        className="
                  w-full
                  mt-4
                  flex flex-row justify-center 
                  text-2xl
                  sm:text-3xl
                  font-extrabold 
                  text-sky-900 
                  underline underline-offset-auto decoration-blue-300
                  select-none"
      >
        <div className="flex flex-row whitespace-nowrap">
          Sea Sweeper
          <GiBroom />
        </div>
      </div>
    );
  }
  return (
    <div
      className="
                ml-8 
                mt-4
                flex flex-row justify-center 
                text-5xl xl:text-6xl 
                font-extrabold 
                text-sky-900 
                underline underline-offset-auto decoration-blue-300
                select-none"
    >
      Sea Sweeper <GiBroom />
    </div>
  );
};

export default Logo;
