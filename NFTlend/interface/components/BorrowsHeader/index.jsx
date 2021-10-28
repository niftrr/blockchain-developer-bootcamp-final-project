import React from "react";
import "./BorrowsHeader.css";

function BorrowsHeader() {
  return (
    <div className="borrows-header oxanium-normal-white-20px">
      <div className="your-borrows valign-text-middle">Your Borrows</div>
      <div className="borrowed valign-text-middle">Borrowed</div>
      <div className="repayment valign-text-middle">Repayment</div>
      <div className="apr valign-text-middle">APR</div>
      <div className="collateral valign-text-middle">Collateral</div>
      <div className="coll-ratio valign-text-middle">Coll. Ratio</div>
      <div className="maturity valign-text-middle">Maturity</div>
    </div>
  );
}

export default BorrowsHeader;
