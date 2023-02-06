import React from "react";
import { IconContext } from "react-icons";
import { GiTrophy } from "react-icons/gi";
import GameOverBoxButton from "./Game/GameOverBox/GameOverBoxButton";
import Modal from "./Modal";

type Props = {
  onClose: () => void;
};

const UpdateModal = ({ onClose }: Props) => {
  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col justify-center">
        <h1 className="modal-header">Update version 1.1</h1>
        <h2 className="modal-subheader">Features</h2>
        <div className="modal-text flex-col items-center justify-center">
          <>
            <h3 className="text-lg font-semibold">
              Daily challenge leaderboard
            </h3>
            Compete for the daily challenge medals and become the champion. The
            leaderboard is accessible via the trophy button:
            <div className="mx-auto w-24 h-12 flex justify-center items-center border rounded-md shadow-lg border-sky-900">
              <IconContext.Provider value={{ color: "#D6AF36", size: "28" }}>
                <GiTrophy />
              </IconContext.Provider>
            </div>
          </>
          <>
            <h3 className="text-lg font-semibold mt-2">Right click to mark</h3>
            Right click on a tile to mark it as a bomb.
          </>
        </div>
        <div className="modal-subheader mt-4">Bug fixes</div>
        <div className="modal-text flex-col items-center justify-center">
          <div>
            Trying to place a lighthouse on a tile that already has a lighthouse
            no longer wastes the lighthouse.
          </div>
          <div>Multiple minor bug fixes.</div>
        </div>
        <div className="my-2">
          <GameOverBoxButton label={"Ok"} onClick={onClose} />
        </div>
      </div>
    </Modal>
  );
};

export default UpdateModal;
