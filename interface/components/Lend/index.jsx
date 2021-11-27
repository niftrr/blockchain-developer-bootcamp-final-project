import React, { useEffect } from "react";
import TokenLend from "../TokenLend";
import ButtonDeposit from "../ButtonDeposit";
import ButtonWithdraw from "../ButtonWithdraw";
import "./Lend.css";
import { useWeb3React } from "@web3-react/core";
import useNToken from "../../hooks/useNToken";

function Lend(props) {
  const { account } = useWeb3React();
  const {fetchNTokenBalance, nTokenBalanceDAI, nTokenBalanceWETH, nTokenBalanceUSDC, 
    fetchNTokenYield, nTokenYieldDAI, nTokenYieldWETH, nTokenYieldUSDC } = useNToken();
  const { buttonDepositProps, buttonRepayProps, token } = props;
  
  const nTokenBalance = {
    "DAI": nTokenBalanceDAI,
    "USDC": nTokenBalanceUSDC,
    "WETH": nTokenBalanceWETH,
  }
  
  const nTokenYield = {
    "DAI": nTokenYieldDAI,
    "USDC": nTokenYieldUSDC,
    "WETH": nTokenYieldWETH
  }

  useEffect(() => {
    if (account) {
      fetchNTokenBalance('DAI');
      fetchNTokenBalance('USDC');
      fetchNTokenBalance('WETH');
      fetchNTokenYield('DAI');
      fetchNTokenYield('USDC');
      fetchNTokenYield('WETH');
    }    
  }, [account, nTokenBalanceDAI,nTokenBalanceUSDC,nTokenBalanceWETH]);

  const formatNumber = (value) => {
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
