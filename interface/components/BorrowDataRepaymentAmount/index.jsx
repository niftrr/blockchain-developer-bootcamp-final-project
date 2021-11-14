import React from "react";
import "./BorrowDataCollRatio.css";
import { useAppContext } from "../../AppContext";

function BorrowDataCollRatio(props) {
  const { maturity, className } = props;
  const { borrowRepaymentAmount, borrowMaturity, borrowAPR, borrowAmount } = useAppContext();

  return (
    <div className={`borrow-data-coll-ratio oxanium-normal-black-20px ${className || ""}`}>
      <div className="repayment-amount valign-text-middle">{maturity}</div>
      <div className="phone-1 valign-text-middle">{String(Number(borrowAmount*(1 + borrowAPR/100*borrowMaturity/52)).toFixed(4))}</div>
    </div>
  );
}

export default BorrowDataCollRatio;
