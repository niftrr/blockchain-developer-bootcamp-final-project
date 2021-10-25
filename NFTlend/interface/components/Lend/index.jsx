import React from "react";
import TokenLend from "../TokenLend";
import ButtonBorrow from "../ButtonBorrow";
import ButtonRepay from "../ButtonRepay";
import "./Lend.css";

function Lend(props) {
  const { buttonBorrowProps, buttonRepayProps } = props;

  return (
    <div className="lend">
      <TokenLend />
      <div className="text-1-1 valign-text-middle oxanium-normal-black-24px">20,034.9031</div>
      <div className="percent-4 valign-text-middle oxanium-normal-black-25px">20%</div>
      <ButtonBorrow className={buttonBorrowProps.className}>{buttonBorrowProps.children}</ButtonBorrow>
      <ButtonRepay className={buttonRepayProps.className}>{buttonRepayProps.children}</ButtonRepay>
    </div>
  );
}

export default Lend;
