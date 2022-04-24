import React from "react";
import { GiBroom } from "react-icons/gi";

type Props = {
  variant?: string;
};

const Logo = ({ variant = "logo-large" }: Props) => {
  const wrapperClassName = `logo-base ${variant}`;

  return (
    <div className={wrapperClassName}>
      <div className="logo-text">
        Sea Sweeper
        <GiBroom />
      </div>
    </div>
  );
};

export default Logo;
