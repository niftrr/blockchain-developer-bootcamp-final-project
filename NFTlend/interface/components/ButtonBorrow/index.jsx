import React from "react";
import { Link } from "react-router-dom";
import "./ButtonBorrow.css";


function ButtonBorrow(props) {
  const { children, className } = props;

  return (
    <button className={`borrow-button-deposit-3 ${className || ""}`}>
      <div className="borrow-place-9 valign-text-middle oxanium-normal-white-20px">{children}</div>
    </button>
  );
}

export default ButtonBorrow;
