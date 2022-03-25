import { GiBroom } from "react-icons/gi";

const Logo = ({ variant = "logo-large" }) => {
  return (
    <div className={`logo-base ${variant}`}>
      <div className="logo-text">
        Sea Sweeper
        <GiBroom />
      </div>
    </div>
  );
};

export default Logo;
