import React from "react";
import { ClipLoader } from "react-spinners";
import { useQuery } from "react-query";

// utils
import { fetchLeaderboard } from "../../utils/apiUtils";

// components
import LeaderboardChampion from "./LeaderboardListChampion";
import LeaderboardListHeaders from "./LeaderboardListHeaders";
import LeaderboardListRow from "./LeaderboardListRow";

const LeaderboardList = () => {
  // fetch leaderboard on mount
  const { data, isLoading, error } = useQuery("leaderboard", fetchLeaderboard, {
    refetchOnWindowFocus: false,
  });

  return (
    <div
      className="
        w-96 
        py-6 
        flex flex-col items-center 
        bg-sky-50 
        shadow-inner"
    >
      <div
        className="
          w-80 max-h-80 
          overflow-auto
          flex flex-col justify-start items-center"
      >
        {!error ? (
          isLoading ? (
            <div className="h-12 m-auto text-sky-800 flex items-center">
              <ClipLoader color="text-sky-800" />
            </div>
          ) : (
            <div className="flex flex-col">
              <LeaderboardChampion leaderboardEntry={data![0]} />
              <LeaderboardListHeaders />
              {data?.map((el, idx) => (
                <LeaderboardListRow leaderboardEntry={el} index={idx} />
              ))}
            </div>
          )
        ) : (
          <div className="h-12 m-auto text-sky-800 flex items-center">
            Error fetching leaderboard.
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardList;
