import React from "react";

type Props = {
  children: React.ReactNode;
  onClose: () => void;
};

const Modal = ({ children, onClose }: Props) => {
  return (
    <div
      className="absolute w-screen h-screen top-0 bg-black bg-opacity-20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-auto my-2 md:mt-20 p-8 w-full max-w-lg shadow-2xl bg-white"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
