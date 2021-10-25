import React from "react";
import "./BorrowsHeader.css";

function BorrowsHeader() {
  return (
    <div className="borrows-header oxanium-normal-white-20px">
      <div className="your-borrows valign-text-middle">Your Borrows</div>
      <div className="borrowed-1 valign-text-middle">Borrowed</div>
      <div className="repayment-1 valign-text-middle">Repayment</div>
      <div className="apr-3 valign-text-middle">APR</div>
      <div className="collateral-1 valign-text-middle">Collateral</div>
      <div className="coll-ratio-1 valign-text-middle">Coll. Ratio</div>
      <div className="maturity-2 valign-text-middle">Maturity</div>
    </div>
  );
}

export default BorrowsHeader;
