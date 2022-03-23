const IconBadge = ({ icon, value, tooltip }) => {
  const badgeContent = () => (
    <div
      className="
    w-full h-full
    mx-4
    font-semibold
    text-lg
    flex justify-between items-center"
      data-tip={tooltip}
      data-for="badgeInfo"
    >
      {icon}
      {value && <div className="ml-1 sm:ml-2">{value}</div>}
    </div>
  );

  return (
    <>
      <div
        className="
      icon-badge-base
      text-sky-900
      border-sky-900
      border-dashed
      "
      >
        {badgeContent()}
      </div>
    </>
  );
};

export default IconBadge;
