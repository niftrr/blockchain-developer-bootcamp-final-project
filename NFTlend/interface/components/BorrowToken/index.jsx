import React from "react";
import InputDropdown from "../InputDropdown";
import "./BorrowToken.css";

function BorrowToken(props) {
  const { token, className, inputDropdownProps } = props;

  return (
    <div className={`borrow-token ${className || ""}`}>
      <div className="token valign-text-middle oxanium-normal-black-20px">{token}</div>
      <InputDropdown className={inputDropdownProps.className} />
    </div>
  );
}

export default BorrowToken;
