import React from "react";
import "./LendsHeader.css";

function LendsHeader() {
  return (
    <div className="lends-header oxanium-normal-white-20px">
      <div className="your-lends valign-text-middle">Your Lends</div>
      <div className="market-size valign-text-middle">Market Size</div>
      <div className="current-balance valign-text-middle">Current Balance</div>
      <div className="apy valign-text-middle">APY</div>
    </div>
  );
}

export default LendsHeader;
