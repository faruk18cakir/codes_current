

import React from "react";

const Loading = () => {

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-base-200 ">
      <div className="text-center max-w-72 bg-base-100 p-10 rounded-lg shadow-md">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    </div>
  );
};

export default Loading;
