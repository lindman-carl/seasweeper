import { GiBroom } from "react-icons/gi";

const Logo = (props) => {
  return (
    <div
      className="
                ml-8 
                flex flex-row justify-center 
                text-4xl lg:text-5xl xl:text-6xl 
                font-extrabold 
                text-sky-900 
                underline underline-offset-auto decoration-blue-300"
    >
      Sea Sweeper <GiBroom />
    </div>
  );
};

export default Logo;
