import React from "react";

// icons
import { MdOpenInNew } from "react-icons/md";

const SignatureFooter = () => {
  return (
    <div className="text-base text-sky-900 font-light text-center inline-flex gap-4 my-4">
      @lindman_dev
      <a
        href="https://github.com/yoga-python/seasweeper"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 font-semibold underline decoration-2 underline-offset-auto decoration-blue-300 "
      >
        GitHub
        <MdOpenInNew />
      </a>
    </div>
  );
};

export default SignatureFooter;
