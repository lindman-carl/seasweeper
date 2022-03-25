import { GiBroom } from "react-icons/gi";

const Logo = ({ variant = "logo-large" }) => {
  return (
    <div className={`logo-base ${variant}`}>
      <div className="flex flex-row whitespace-nowrap">
        Sea Sweeper
        <GiBroom />
      </div>
    </div>
  );
};

export default Logo;
