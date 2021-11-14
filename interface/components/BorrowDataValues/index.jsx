import React from "react";
import "./BorrowDataValues.css";

function BorrowDataValues(props) {
  const { borrowAmount, address, className } = props;

  return (
    <div className={`borrow-data-floor-price-borrowPopUpData oxanium-normal-black-20px ${className || ""}`}>
      <div className="borrow-amount-borrowPopUpData valign-text-middle">{borrowAmount}</div>
      <div className="address-borrowPopUpData valign-text-middle">{address} Weeks</div>
    </div>
  );
}

export default BorrowDataValues;
