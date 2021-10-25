import React from "react";
import "./ButtonBorrow.css";

function ButtonBorrow(props) {
  const { children, className } = props;

  return (
    <div className={`button-borrow-2 ${className || ""}`}>
      <div className="borrow-7 valign-text-middle oxanium-normal-white-20px">{children}</div>
    </div>
  );
}

export default ButtonBorrow;
