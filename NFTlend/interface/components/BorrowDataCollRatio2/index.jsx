import React from "react";
import "./BorrowDataCollRatio2.css";

function BorrowDataCollRatio2(props) {
  const { collateralRatio, percent, className } = props;

  return (
    <div className={`borrow-data-coll-ratio-2 oxanium-normal-black-20px ${className || ""}`}>
      <div className="collateral-ratio valign-text-middle">{collateralRatio}</div>
      <div className="percent-1 valign-text-middle">{percent}</div>
    </div>
  );
}

export default BorrowDataCollRatio2;
