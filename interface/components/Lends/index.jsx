import React from "react";
import LendsHeader from "../LendsHeader";
import Lend from "../Lend";
import "./Lends.css";

function Lends(props) {
  const { className, lendProps } = props;

  const tokenList = [
    "DAI",
    "USDC",
    "WETH"
  ]

  return (
    <div className={`lends ${className || ""}`}>
    <LendsHeader />
    {tokenList.map(token => (
      <Lend buttonBorrowProps={lendProps.buttonBorrowProps} buttonRepayProps={lendProps.buttonRepayProps} token={token} key={token} />
    ))}
    </div>
  );
}

export default Lends;
