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
    const debtTokenContractAddressDAI = "0x2a810409872AfC346F9B5b26571Fd6eC42EA4849"; // hardhat
    const debtTokenContractAddressETH = "0xb9bEECD1A582768711dE1EE7B0A1d582D9d72a6C"; // hardhat
    const debtTokenContractAddressUSDC = "0x8A93d247134d91e0de6f96547cB0204e5BE8e5D8"; // hardhat
    
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