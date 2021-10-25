import React from "react";
import "./ButtonRepay.css";

function ButtonRepay(props) {
  const { children, className } = props;

  return (
    <div className={`button-repay-1 ${className || ""}`}>
      <div className="repay valign-text-middle oxanium-normal-black-20px">{children}</div>
    </div>
  );
}

export default ButtonRepay;
