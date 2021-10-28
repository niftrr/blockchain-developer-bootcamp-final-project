import React from "react";
import LendsHeader from "../LendsHeader";
import Lend from "../Lend";
import "./Lends.css";

function Lends(props) {
  const { className, lendProps, lend2Props, lend3Props, ethBalance, daiBalance } = props;

  return (
    <div className={`lends ${className || ""}`}>
      <LendsHeader />
      <Lend buttonBorrowProps={lendProps.buttonBorrowProps} buttonRepayProps={lendProps.buttonRepayProps} ethBalance={ethBalance} daiBalance={daiBalance} />
      <Lend buttonBorrowProps={lend2Props.buttonBorrowProps} buttonRepayProps={lend2Props.buttonRepayProps} ethBalance={ethBalance} daiBalance={daiBalance} />
      <Lend buttonBorrowProps={lend3Props.buttonBorrowProps} buttonRepayProps={lend3Props.buttonRepayProps} ethBalance={ethBalance} daiBalance={daiBalance} />
    </div>
  );
}

export default Lends;
