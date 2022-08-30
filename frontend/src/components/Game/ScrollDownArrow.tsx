import React from "react";

// icons
import { RiArrowDownSLine } from "react-icons/ri";
import ReactTooltip from "react-tooltip";

const ScrollDownArrow = () => {
  const scrollToHighscoreList = () =>
    // scroll down 1000px, ie max
    window.scrollTo({
      top: 1000,
      behavior: "smooth",
    });

  // hidden on larger screens
  return (
    <div
      className="
        lg:hidden 
        h-full 
        mt-auto 
        flex items-end grow 
        cursor-pointer"
      onClick={scrollToHighscoreList}
    >
      <div
        className="my-4 animate-pulse text-sky-700"
        data-for="down-arrow"
        data-tip="Scroll down for highscorelist"
      >
        <RiArrowDownSLine size={24} />
      </div>
      <ReactTooltip
        id="down-arrow"
        type="info"
        effect="solid"
        delayShow={600}
        place="top"
      />
    </div>
  );
};

export default ScrollDownArrow;
