import { useContract } from "./useContract";
import DebtTokenData from "../artifacts/contracts/Debttoken.sol/DebtToken.json";
import useIsValidNetwork from "./useIsValidNetwork";
import { useWeb3React } from "@web3-react/core";
import { useAppContext } from "../AppContext";
import { formatUnits } from "@ethersproject/units";
import { useEffect } from "react";

export const useDebtToken = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();
    // DebtTokens
    const debtTokenContractAddressDAI = process.env.REACT_APP_DEBT_TOKEN_DAI_CONTRACT_ADDRESS;
    const debtTokenContractAddressUSDC =  process.env.REACT_APP_DEBT_TOKEN_USDC_CONTRACT_ADDRESS;
    const debtTokenContractAddressWETH = process.env.REACT_APP_DEBT_TOKEN_WETH_CONTRACT_ADDRESS;
    
    const debtTokenABI = DebtTokenData["abi"];
    const debtTokenContractDAI = useContract(debtTokenContractAddressDAI, debtTokenABI);
    const debtTokenContractUSDC = useContract(debtTokenContractAddressUSDC, debtTokenABI);
    const debtTokenContractWETH = useContract(debtTokenContractAddressWETH, debtTokenABI);
    const debtTokenContract = {
        "DAI": debtTokenContractDAI,
        "USDC": debtTokenContractUSDC,
        "WETH": debtTokenContractWETH
    }
    const {
        setDebtTokenBalanceDAI,
        setDebtTokenBalanceUSDC, 
        setDebtTokenBalanceWETH,
        debtTokenBalanceDAI, 
        debtTokenBalanceUSDC,
        debtTokenBalanceWETH
    } = useAppContext();

    const fetchDebtTokenBalance = async (ccy) => {
        
        switch(ccy) {
            case "DAI":
                const debtTokenBalanceDAI = await debtTokenContractDAI.balanceOf(account);
                setDebtTokenBalanceDAI(formatUnits(debtTokenBalanceDAI, 18));
            case "USDC":
                const debtTokenBalanceUSDC = await debtTokenContractUSDC.balanceOf(account);
                setDebtTokenBalanceUSDC(formatUnits(debtTokenBalanceUSDC, 18));
            case "WETH":
                const debtTokenBalanceWETH = await debtTokenContractWETH.balanceOf(account);
                setDebtTokenBalanceWETH(formatUnits(debtTokenBalanceWETH, 18));
        }
    };

    return {
        debtTokenBalanceDAI,
        debtTokenBalanceUSDC,
        debtTokenBalanceWETH,
        fetchDebtTokenBalance,
        debtTokenContract
    }
};

export default useDebtToken;