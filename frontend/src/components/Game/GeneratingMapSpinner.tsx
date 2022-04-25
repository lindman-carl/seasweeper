import React from "react";

// spinner
import { ClipLoader } from "react-spinners";

const GeneratingMapSpinner = () => {
  return (
    <div className="w-full min-h-[50vh] flex flex-column items-center justify-center">
      <div className="font-thin">Generating map...</div>
      <ClipLoader size={20} />
    </div>
  );
};

export default GeneratingMapSpinner;
