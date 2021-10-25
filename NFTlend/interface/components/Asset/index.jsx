import React from "react";
import Header from "../Header";
import Background from "../Background";
import PreviousBorrow from "../PreviousBorrow";
import Asset2 from "../Asset2";
import Instructions from "../Instructions";
import "./Asset.css";

function Asset(props) {
  const {
    prevBorrows,
    borrowed,
    repayment,
    apr,
    collateral,
    collRatio,
    maturity,
    borrower,
    status,
    previousBorrowProps,
    asset2Props,
  } = props;

  return (
    <div className="container-center-horizontal">
      <div className="asset screen">
        <Header />
        <div className="overlap-group2">
          <Background />
          <div className="overlap-group1">
            <div className="borrows-container"></div>
            <PreviousBorrow {...previousBorrowProps} />
            <div className="previous-borrows-header oxanium-normal-white-20px">
              <div className="prev-borrows valign-text-middle">{prevBorrows}</div>
              <div className="borrowed valign-text-middle">{borrowed}</div>
              <div className="repayment valign-text-middle">{repayment}</div>
              <div className="apr valign-text-middle">{apr}</div>
              <div className="collateral valign-text-middle">{collateral}</div>
              <div className="coll-ratio valign-text-middle">{collRatio}</div>
              <div className="maturity valign-text-middle">{maturity}</div>
              <div className="borrower valign-text-middle">{borrower}</div>
              <div className="status valign-text-middle">{status}</div>
            </div>
          </div>
          <Asset2
            borrowDataCollRatioProps={asset2Props.borrowDataCollRatioProps}
            borrowDataCollRatio2Props={asset2Props.borrowDataCollRatio2Props}
            borrowDataCollRatio22Props={asset2Props.borrowDataCollRatio22Props}
            borrowDataCollRatio2Props2={asset2Props.borrowDataCollRatio2Props2}
            borrowDataCollRatio3Props={asset2Props.borrowDataCollRatio3Props}
          />
          <Instructions />
        </div>
      </div>
    </div>
  );
}

export default Asset;
