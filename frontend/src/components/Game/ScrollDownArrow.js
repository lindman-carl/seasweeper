import { RiArrowDownSLine } from "react-icons/ri";

const ScrollDownArrow = () => {
  return (
    <div
      className="lg:hidden grow h-full mt-auto flex items-end cursor-pointer"
      onClick={() =>
        window.scrollTo({
          top: 1000,
          behavior: "smooth",
        })
      }
    >
      <div className="mb-4 animate-pulse text-sky-700">
        <RiArrowDownSLine size={24} />
      </div>
    </div>
  );
};

export default ScrollDownArrow;
