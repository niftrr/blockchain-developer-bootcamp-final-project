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
    const debtTokenContractAddressDAI = "0x0B306BF915C4d645ff596e518fAf3F9669b97016"; // hardhat
    const debtTokenContractAddressETH = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1"; // hardhat
    const debtTokenContractAddressUSDC = "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE"; // hardhat
    
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
        setDebtTokenBalance, 
        debtTokenBalanceDAI, 
        debtTokenBalanceETH, 
        debtTokenBalanceUSDC} = useAppContext();

    const fetchDebtTokenBalance = async (ccy) => {
        const debtTokenBalance = await debtTokenContract[ccy].balanceOf(account);
        setDebtTokenBalance(ccy, formatUnits(debtTokenBalance, 18));
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