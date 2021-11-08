import React, { useEffect } from "react";
import TokenLend from "../TokenLend";
import ButtonDeposit from "../ButtonDeposit";
import ButtonWithdraw from "../ButtonWithdraw";
import "./Lend.css";
import { useWeb3React } from "@web3-react/core";
import useNToken from "../../hooks/useNToken";

function Lend(props) {
  const { account } = useWeb3React();
  const { nTokenBalanceDAI, nTokenYieldDAI, fetchNTokenBalance, fetchNTokenYield } = useNToken();
  const { buttonDepositProps, buttonRepayProps } = props;

  useEffect(() => {
    if (account) {
      fetchNTokenBalance('DAI');
      fetchNTokenYield('DAI');
    }    
  }, [account]);

  return (
    <div className="lend">
      <TokenLend />
      <div className="text-2 valign-text-middle oxanium-normal-black-24px">{nTokenBalanceDAI}</div>
      <div className="percent-1 valign-text-middle oxanium-normal-black-25px">{nTokenYieldDAI}</div>
      <ButtonDeposit ethBalance={0} daiBalance={1}>Deposit</ButtonDeposit>
      <ButtonWithdraw>Withdraw</ButtonWithdraw>
    </div>
  );
}

export default Lend;
