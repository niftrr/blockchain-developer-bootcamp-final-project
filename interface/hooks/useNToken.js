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
    const nTokenContractAddressETH = process.env.REACT_APP_N_TOKEN_ETH_CONTRACT_ADDRESS; 
    const nTokenContractAddressUSDC = process.env.REACT_APP_N_TOKEN_USDC_CONTRACT_ADDRESS; 
    // AssetTokens
    const assetTokenContractAddressDAI = process.env.REACT_APP_ASSET_TOKEN_DAI_CONTRACT_ADDRESS;
    const assetTokenContractAddressETH = process.env.REACT_APP_ASSET_TOKEN_ETH_CONTRACT_ADDRESS;
    const assetTokenContractAddressUSDC = process.env.REACT_APP_ASSET_TOKEN_USDC_CONTRACT_ADDRESS;
    const assetTokenContractAddress = {
        "DAI": assetTokenContractAddressDAI,
        "ETH": assetTokenContractAddressETH,
        "USDC": assetTokenContractAddressUSDC
    }
    const nTokenABI = NTokenData["abi"];
    const nTokenContractDAI = useContract(nTokenContractAddressDAI, nTokenABI);
    const nTokenContractETH = useContract(nTokenContractAddressETH, nTokenABI);
    const nTokenContractUSDC = useContract(nTokenContractAddressUSDC, nTokenABI);
    const nTokenContract = {
        "DAI": nTokenContractDAI,
        "ETH": nTokenContractETH,
        "USDC": nTokenContractUSDC
    }
    const {setNTokenBalanceDAI, setNTokenBalanceETH, setNTokenBalanceUSDC, 
        setNTokenYieldDAI, setNTokenYieldETH, setNTokenYieldUSDC, setTxnStatus, 
        nTokenBalanceDAI, nTokenBalanceETH, nTokenBalanceUSDC,
        nTokenYieldDAI, nTokenYieldETH, nTokenYieldUSDC} = useAppContext();

    const fetchNTokenBalance = async (ccy) => {
        switch(ccy) {
            case "DAI":
                const nTokenBalanceDAI = await nTokenContractDAI.balanceOf(account);
                setNTokenBalanceDAI(formatUnits(nTokenBalanceDAI, 18));
            case "ETH": 
                const nTokenBalanceETH = await nTokenContractETH.balanceOf(account);
                setNTokenBalanceETH(formatUnits(nTokenBalanceETH, 18));
            case "USDC":
                const nTokenBalanceUSDC = await nTokenContractUSDC.balanceOf(account);
                setNTokenBalanceUSDC(formatUnits(nTokenBalanceUSDC, 18));
        }
    };

    const fetchNTokenYield = async (ccy) => {
        switch(ccy) {
            case "DAI":
                const nTokenYieldDAI = await nTokenContractDAI.getCurrentAPY();
                setNTokenYieldDAI(formatUnits(nTokenYieldDAI, 18));
            case "ETH": 
                const nTokenYieldETH = await nTokenContractETH.getCurrentAPY();
                setNTokenYieldETH(formatUnits(nTokenYieldETH, 18));
            case "USDC":
                const nTokenYieldUSDC = await nTokenContractUSDC.getCurrentAPY();
                setNTokenYieldUSDC(formatUnits(nTokenYieldUSDC, 18));
        }
    };

    return {
        nTokenBalanceDAI,
        nTokenBalanceETH,
        nTokenBalanceUSDC,
        fetchNTokenBalance,
        nTokenYieldDAI,
        nTokenYieldETH,
        nTokenYieldUSDC,
        fetchNTokenYield,
        assetTokenContractAddress,
        nTokenContract
    }
};

export default useNToken;