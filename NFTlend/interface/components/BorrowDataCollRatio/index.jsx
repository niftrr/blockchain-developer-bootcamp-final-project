import React from "react";
import "./BorrowDataCollRatio.css";

function BorrowDataCollRatio(props) {
  const { maturity, d, className } = props;

  return (
    <div className={`borrow-data-coll-ratio oxanium-normal-black-20px ${className || ""}`}>
      <div className="repayment-amount valign-text-middle">{maturity}</div>
      <div className="phone-1 valign-text-middle">{d}</div>
    </div>
  );
}

export default BorrowDataCollRatio;
