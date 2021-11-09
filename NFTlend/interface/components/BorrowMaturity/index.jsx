import React from "react";
import InputDropdownMaturity from "../InputDropdownMaturity";
import "./BorrowMaturity.css";

function BorrowMaturity(props) {
  const { token, className, inputDropdownProps } = props;

  return (
    <div className={`borrow-token ${className || ""}`}>
      <div className="token valign-text-middle oxanium-normal-black-20px">{token}</div>
      <InputDropdownMaturity className={inputDropdownProps.className} />
    </div>
  );
}

export default BorrowMaturity;
