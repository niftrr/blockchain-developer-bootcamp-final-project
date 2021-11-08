import React, { useEffect } from "react";
import TokenLend from "../TokenLend";
import ButtonDeposit from "../ButtonDeposit";
import ButtonWithdraw from "../ButtonWithdraw";
import "./Lend.css";
import { useWeb3React } from "@web3-react/core";
import useNToken from "../../hooks/useNToken";

function Lend(props) {
  const { account } = useWeb3React();
  const {fetchNTokenBalance, nTokenBalanceDAI, nTokenBalanceETH, nTokenBalanceUSDC, 
    fetchNTokenYield, nTokenYieldDAI, nTokenYieldETH, nTokenYieldUSDC } = useNToken();
  const { buttonDepositProps, buttonRepayProps, token } = props;
  
  const nTokenBalance = {
    "DAI": nTokenBalanceDAI,
    "ETH": nTokenBalanceETH,
    "USDC": nTokenBalanceUSDC
  }
  
  const nTokenYield = {
    "DAI": nTokenYieldDAI,
    "ETH": nTokenYieldETH,
    "USDC": nTokenYieldUSDC
  }

  useEffect(() => {
    if (account) {
      fetchNTokenBalance('DAI');
      fetchNTokenBalance('ETH');
      fetchNTokenBalance('USDC');
      fetchNTokenYield('DAI');
      fetchNTokenYield('ETH');
      fetchNTokenYield('USDC');
    }    
  }, [account]);

  return (
    <div className="lend">
      <TokenLend token={token} />
      <div className="text-2 valign-text-middle oxanium-normal-black-24px">{nTokenBalance[token]}</div>
      <div className="percent-1 valign-text-middle oxanium-normal-black-25px">{nTokenYield[token]}</div>
      <ButtonDeposit ethBalance={0} daiBalance={1}>Deposit</ButtonDeposit>
      <ButtonWithdraw>Withdraw</ButtonWithdraw>
    </div>
  );
}

export default Lend;
