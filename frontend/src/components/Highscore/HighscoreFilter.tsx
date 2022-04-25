import React from "react";

// icons
import { MdSearch } from "react-icons/md";

type Props = {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
};

const HighscoreFilter = ({ onChange }: Props) => {
  return (
    <div className="highscores-filter-container">
      <MdSearch size={16} />
      <input
        className="highscores-filter-input"
        type="text"
        placeholder={"filter names"}
        onChange={onChange}
      />
    </div>
  );
};

export default HighscoreFilter;
