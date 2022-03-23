import { MdSearch } from "react-icons/md";

const HighscoreFilter = ({ onChange }) => {
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
