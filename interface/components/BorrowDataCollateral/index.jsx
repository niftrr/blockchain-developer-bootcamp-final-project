import React from "react";
import "./BorrowDataCollRatio.css";
import { useAppContext } from "../../AppContext";

function BorrowDataCollateral(props) {
  const { maturity, className } = props;
  const { borrowNFT, borrowProject } = useAppContext();

  return (
    <div className={`borrow-data-coll-ratio oxanium-normal-black-20px ${className || ""}`}>
      <div className="repayment-amount valign-text-middle">{maturity}</div>
      <div className="phone-1 valign-text-middle">{borrowProject} #{borrowNFT}</div>
    </div>
  );
}

export default BorrowDataCollateral;
