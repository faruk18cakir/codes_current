import React from "react";

const Toast = ({ message }) => {
  if (!message) return null;
  return (
    <div className="toast toast-bottom toast-right z-[600]">
      <div className="alert alert-info">
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
