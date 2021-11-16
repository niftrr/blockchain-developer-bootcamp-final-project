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
    const nTokenContractAddressDAI = "0x0165878A594ca255338adfa4d48449f69242Eb8F"; // hardhat
    const nTokenContractAddressETH = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"; // hardhat
    const nTokenContractAddressUSDC = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"; // hardhat
    // AssetTokens
    const assetTokenContractAddressDAI = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // hardhat
    const assetTokenContractAddressETH = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"; // hardhat
    const assetTokenContractAddressUSDC = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; // hardhat
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