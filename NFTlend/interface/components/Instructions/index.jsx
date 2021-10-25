import React from "react";
import "./Instructions.css";

function Instructions() {
  return (
    <div className="instructions">
      <div className="text-3 valign-text-middle oxanium-bold-web-orange-24px">
        <span>
          <span className="oxanium-bold-web-orange-24px">
            Deposit your NFTs to instantly access permission-less loans.
            <br />
          </span>
          <span className="oxanium-extra-light-web-orange-24px">
            Note that borrows not repaid by maturity or collaterized by less than 150% may be liquidated.
          </span>
        </span>
      </div>
    </div>
  );
}

export default Instructions;
