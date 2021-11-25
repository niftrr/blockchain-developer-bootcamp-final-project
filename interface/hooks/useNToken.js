import { useContract } from "./useContract";
import NTokenData from "../../v1-core/artifacts/contracts/Ntoken.sol/NToken.json";
import useIsValidNetwork from "../hooks/useIsValidNetwork";
import { useWeb3React } from "@web3-react/core";
import { useAppContext } from "../AppContext";
import { formatUnits } from "@ethersproject/units";
import { useEffect } from "react";

export const useNToken = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();
    // NTokens
    const nTokenContractAddressDAI = process.env.REACT_APP_N_TOKEN_DAI_CONTRACT_ADDRESS; 
    const nTokenContractAddressUSDC = process.env.REACT_APP_N_TOKEN_USDC_CONTRACT_ADDRESS; 
    const nTokenContractAddressWETH = process.env.REACT_APP_N_TOKEN_WETH_CONTRACT_ADDRESS; 
    // AssetTokens
    const assetTokenContractAddressDAI = process.env.REACT_APP_ASSET_TOKEN_DAI_CONTRACT_ADDRESS;
    const assetTokenContractAddressUSDC = process.env.REACT_APP_ASSET_TOKEN_USDC_CONTRACT_ADDRESS;
    const assetTokenContractAddressWETH = process.env.REACT_APP_ASSET_TOKEN_WETH_CONTRACT_ADDRESS;
    const assetTokenContractAddress = {
        "DAI": assetTokenContractAddressDAI,
        "USDC": assetTokenContractAddressUSDC,
        "WETH": assetTokenContractAddressWETH
    }
    const nTokenABI = NTokenData["abi"];
    const nTokenContractDAI = useContract(nTokenContractAddressDAI, nTokenABI);
    const nTokenContractUSDC = useContract(nTokenContractAddressUSDC, nTokenABI);
    const nTokenContractWETH = useContract(nTokenContractAddressWETH, nTokenABI);
    const nTokenContract = {
        "DAI": nTokenContractDAI,
        "USDC": nTokenContractUSDC,
        "WETH": nTokenContractWETH
    }
    const {setNTokenBalanceDAI, setNTokenBalanceWETH, setNTokenBalanceUSDC, 
        setNTokenYieldDAI, setNTokenYieldWETH, setNTokenYieldUSDC, setTxnStatus, 
        nTokenBalanceDAI, nTokenBalanceWETH, nTokenBalanceUSDC,
        nTokenYieldDAI, nTokenYieldWETH, nTokenYieldUSDC} = useAppContext();

    const fetchNTokenBalance = async (ccy) => {
        switch(ccy) {
            case "DAI":
                const nTokenBalanceDAI = await nTokenContractDAI.balanceOf(account);
                setNTokenBalanceDAI(formatUnits(nTokenBalanceDAI, 18));
            case "USDC":
                const nTokenBalanceUSDC = await nTokenContractUSDC.balanceOf(account);
                setNTokenBalanceUSDC(formatUnits(nTokenBalanceUSDC, 18));
            case "WETH": 
                const nTokenBalanceWETH = await nTokenContractWETH.balanceOf(account);
                setNTokenBalanceWETH(formatUnits(nTokenBalanceWETH, 18));
        }
    };

    const fetchNTokenYield = async (ccy) => {
        switch(ccy) {
            case "DAI":
                const nTokenYieldDAI = await nTokenContractDAI.getCurrentAPY();
                setNTokenYieldDAI(formatUnits(nTokenYieldDAI, 18));
            case "USDC":
                const nTokenYieldUSDC = await nTokenContractUSDC.getCurrentAPY();
                setNTokenYieldUSDC(formatUnits(nTokenYieldUSDC, 18));
            case "WETH": 
                const nTokenYieldWETH = await nTokenContractWETH.getCurrentAPY();
                setNTokenYieldWETH(formatUnits(nTokenYieldWETH, 18));
        }
    };

    return {
        nTokenBalanceDAI,
        nTokenBalanceUSDC,
        nTokenBalanceWETH,
        fetchNTokenBalance,
        nTokenYieldDAI,
        nTokenYieldUSDC,
        nTokenYieldWETH,
        fetchNTokenYield,
        assetTokenContractAddress,
        nTokenContract
    }
};

export default useNToken;