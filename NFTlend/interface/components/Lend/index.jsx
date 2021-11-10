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
  }, [account, nTokenBalanceDAI]);

  const formatNumber = (value) => {
    console.log('formatNumber', typeof(value));
    let res;
    if (value=="--") {
      res = value;
    } else {
      res = Number(value).toFixed(1);
    }
    return res;
  }

  return (
    <div className="lend">
      <TokenLend token={token} />
      <div className="text-2 valign-text-middle oxanium-normal-black-24px">{formatNumber(nTokenBalance[token])}</div>
      <div className="percent-1 valign-text-middle oxanium-normal-black-25px">{formatNumber(nTokenYield[token])}</div>
      <ButtonDeposit token={token}>Deposit</ButtonDeposit>
      <ButtonWithdraw token={token}>Withdraw</ButtonWithdraw>
    </div>
  );
}

export default Lend;
