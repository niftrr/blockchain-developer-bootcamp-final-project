import React, { useEffect } from "react";
import TokenLend from "../TokenLend";
import ButtonDeposit from "../ButtonDeposit";
import ButtonWithdraw from "../ButtonWithdraw";
import "./Lend.css";
import { useWeb3React } from "@web3-react/core";
import useNToken from "../../hooks/useNToken";
import { useAppContext } from "../../AppContext";
import useTransaction from "../../hooks/useTransaction";

function Lend(props) {
  const { account } = useWeb3React();
  const {fetchNTokenBalance,  
    fetchNTokenYield, fetchNTokenSupply } = useNToken();
  const { buttonDepositProps, buttonRepayProps, token } = props;
  const { nTokenSupplyDAI, nTokenSupplyWETH, nTokenSupplyUSDC,
    nTokenBalanceDAI, nTokenBalanceWETH, nTokenBalanceUSDC,
    nTokenYieldDAI, nTokenYieldWETH, nTokenYieldUSDC} = useAppContext();
  const { txnStatus } = useTransaction();
  
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

  const nTokenSupply = {
    "DAI": nTokenSupplyDAI,
    "USDC": nTokenSupplyUSDC,
    "WETH": nTokenSupplyWETH 
  }

  useEffect(() => {
    if (account) {
      fetchNTokenBalance();
      fetchNTokenYield();
      fetchNTokenSupply();
    }    
  }, [account, txnStatus, nTokenBalanceDAI,nTokenBalanceUSDC,nTokenBalanceWETH]);

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
      <div className="text-2 valign-text-middle oxanium-normal-black-24px">{formatNumber(nTokenSupply[token])}</div>
      <div className="text-2 valign-text-middle oxanium-normal-black-24px">{formatNumber(nTokenBalance[token])}</div>
      <div className="percent-1 valign-text-middle oxanium-normal-black-25px">{formatNumber(nTokenYield[token])}</div>
      <ButtonDeposit token={token}>Deposit</ButtonDeposit>
      <ButtonWithdraw token={token}>Withdraw</ButtonWithdraw>
    </div>
  );
}

export default Lend;
