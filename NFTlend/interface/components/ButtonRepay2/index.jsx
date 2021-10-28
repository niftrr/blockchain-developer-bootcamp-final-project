import React from "react";
import { Link } from "react-router-dom";
import "./ButtonRepay2.css";

function ButtonRepay2(props) {
  const { children, className } = props;

  return (
    <div className={`button-withdraw-2 ${className || ""}`}>
      <div className="withdraw valign-text-middle oxanium-normal-black-20px">{children}</div>
    </div>
  );
}

export default ButtonRepay2;
