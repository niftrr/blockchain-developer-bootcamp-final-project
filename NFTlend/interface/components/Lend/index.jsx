import React from "react";
import TokenLend from "../TokenLend";
import ButtonDeposit from "../ButtonDeposit";
import ButtonWithdraw from "../ButtonWithdraw";
import "./Lend.css";

function Lend(props) {
  const { buttonDepositProps, buttonRepayProps } = props;

  return (
    <div className="lend">
      <TokenLend />
      <div className="text-2 valign-text-middle oxanium-normal-black-24px">20,034.9031</div>
      <div className="percent-1 valign-text-middle oxanium-normal-black-25px">20%</div>
      <ButtonDeposit>Deposit</ButtonDeposit>
      <ButtonWithdraw>Withdraw</ButtonWithdraw>
    </div>
  );
}

export default Lend;
