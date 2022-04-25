import React from "react";

// icons
import { RiArrowDownSLine } from "react-icons/ri";

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
      <div className="my-4 animate-pulse text-sky-700">
        <RiArrowDownSLine size={24} />
      </div>
    </div>
  );
};

export default ScrollDownArrow;
