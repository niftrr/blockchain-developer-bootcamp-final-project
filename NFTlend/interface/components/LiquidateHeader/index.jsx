import React from "react";
import "./LiquidateHeader.css";

function LiquidateHeader() {
  return (
    <div className="liquidate-header oxanium-normal-white-20px">
      <div className="borrow-defaults valign-text-middle">Borrow Defaults</div>
      <div className="liquidation-reward valign-text-middle">Liquidation Reward</div>
      <div className="collateral-2 valign-text-middle">Collateral</div>
      <div className="coll-ratio-2 valign-text-middle">Coll. Ratio</div>
      <div className="maturity-3 valign-text-middle">Maturity</div>
    </div>
  );
}

export default LiquidateHeader;
