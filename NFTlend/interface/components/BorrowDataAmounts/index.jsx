import React from "react";
import "./BorrowDataAmounts.css";

function BorrowDataAmounts(props) {
  const { borrowAmount, amount, token, className } = props;

  return (
    <div className={`borrow-data-floor-price-borrowPopUpData oxanium-normal-black-20px ${className || ""}`}>
      <div className="borrow-amount-borrowPopUpData valign-text-middle">{borrowAmount}</div>
      <div className="address-borrowPopUpData valign-text-middle">{amount} {token}</div>
    </div>
  );
}

export default BorrowDataAmounts;
