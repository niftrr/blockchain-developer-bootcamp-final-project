import { useContract } from "./useContract";
import DebtTokenData from "../../v1-core/artifacts/contracts/Debttoken.sol/DebtToken.json";
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
    const debtTokenContractAddressETH = process.env.REACT_APP_DEBT_TOKEN_ETH_CONTRACT_ADDRESS;
    const debtTokenContractAddressUSDC =  process.env.REACT_APP_DEBT_TOKEN_USDC_CONTRACT_ADDRESS;
    
    const debtTokenABI = DebtTokenData["abi"];
    const debtTokenContractDAI = useContract(debtTokenContractAddressDAI, debtTokenABI);
    const debtTokenContractETH = useContract(debtTokenContractAddressETH, debtTokenABI);
    const debtTokenContractUSDC = useContract(debtTokenContractAddressUSDC, debtTokenABI);
    const debtTokenContract = {
        "DAI": debtTokenContractDAI,
        "ETH": debtTokenContractETH,
        "USDC": debtTokenContractUSDC
    }
    const {
        setDebtTokenBalanceDAI,
        setDebtTokenBalanceETH,
        setDebtTokenBalanceUSDC, 
        debtTokenBalanceDAI, 
        debtTokenBalanceETH, 
        debtTokenBalanceUSDC} = useAppContext();

    const fetchDebtTokenBalance = async (ccy) => {
        
        switch(ccy) {
            case "DAI":
                const debtTokenBalanceDAI = await debtTokenContractDAI.balanceOf(account);
                setDebtTokenBalanceDAI(formatUnits(debtTokenBalanceDAI, 18));
            case "ETH":
                const debtTokenBalanceETH = await debtTokenContractETH.balanceOf(account);
                setDebtTokenBalanceETH(formatUnits(debtTokenBalanceETH, 18));
            case "USDC":
                const debtTokenBalanceUSDC = await debtTokenContractUSDC.balanceOf(account);
                setDebtTokenBalanceUSDC(formatUnits(debtTokenBalanceUSDC, 18));
        }
    };

    return {
        debtTokenBalanceDAI,
        debtTokenBalanceETH,
        debtTokenBalanceUSDC,
        fetchDebtTokenBalance,
        debtTokenContract
    }
};

export default useDebtToken;