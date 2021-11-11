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
    const debtTokenContractAddressDAI = "0x7A3A9876c08B3f001D10c6a8aF685699BC52e7c8"; // hardhat
    const debtTokenContractAddressETH = "0x76d05F58D14c0838EC630C8140eDC5aB7CD159Dc"; // hardhat
    const debtTokenContractAddressUSDC = "0xe8c3F27D20472e4f3C546A3f73C04B54DD72871d"; // hardhat
    
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