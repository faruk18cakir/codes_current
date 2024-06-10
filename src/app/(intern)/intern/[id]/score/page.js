import React from "react";

const Loading = () => {
  return (
    <div className="flex h-full justify-center items-center">
      <span className="loading loading-ring w-56  h-56"></span>
      <div className="text-3xl text-white">Score</div>
    </div>
  );
};

export default Loading;
