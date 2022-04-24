import React from "react";
import { GiBroom } from "react-icons/gi";

type Props = {
  variant?: string;
};

const Logo = ({ variant = "logo-large" }: Props) => {
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
