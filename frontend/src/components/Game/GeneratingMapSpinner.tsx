import React from "react";

// spinner
import { ClipLoader } from "react-spinners";

const GeneratingMapSpinner = () => {
  return (
    <div className="w-full h-screen min-h-[50vh] flex flex-column items-center justify-center">
      <div className="font-thin mr-1">Generating map...</div>
      <ClipLoader size={14} />
    </div>
  );
};

export default GeneratingMapSpinner;
