import { GiBroom } from "react-icons/gi";

const Logo = ({ size }) => {
  if (size === "sm") {
    return (
      <div
        className="
                  max-w-[6rem]
                  sm:max-w-xs
                  w-full
                  h-12
                  flex flex-row justify-center items-center
                  text-3xl
                  tracking-tighter
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
                tracking-tighter
                text-sky-900 
                underline underline-offset-auto decoration-blue-300
                select-none"
    >
      Sea Sweeper <GiBroom />
    </div>
  );
};

export default Logo;
