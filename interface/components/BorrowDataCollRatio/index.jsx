import React from "react";
import "./BorrowDataCollRatio.css";
import { useAppContext } from "../../AppContext";

function BorrowDataRepaymentAmount(props) {
  const { maturity, className } = props;
  const { borrowRepaymentAmount } = useAppContext();

  return (
    <div className={`borrow-data-coll-ratio oxanium-normal-black-20px ${className || ""}`}>
      <div className="repayment-amount valign-text-middle">{maturity}</div>
      <div className="phone-1 valign-text-middle">{borrowRepaymentAmount}</div>
    </div>
  );
}

export default BorrowDataRepaymentAmount;
