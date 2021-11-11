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
    const nTokenContractAddressDAI = "0x3aAde2dCD2Df6a8cAc689EE797591b2913658659"; // hardhat
    const nTokenContractAddressETH = "0xab16A69A5a8c12C732e0DEFF4BE56A70bb64c926"; // hardhat
    const nTokenContractAddressUSDC = "0xE3011A37A904aB90C8881a99BD1F6E21401f1522"; // hardhat
    // AssetTokens
    const assetTokenContractAddressDAI = "0x3155755b79aA083bd953911C92705B7aA82a18F9"; // hardhat
    const assetTokenContractAddressETH = "0x5bf5b11053e734690269C6B9D438F8C9d48F528A"; // hardhat
    const assetTokenContractAddressUSDC = "0xffa7CA1AEEEbBc30C874d32C7e22F052BbEa0429"; // hardhat
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
    const {setNTokenBalance, setNTokenYield, setTxnStatus, 
        nTokenBalanceDAI, nTokenBalanceETH, nTokenBalanceUSDC,
        nTokenYieldDAI, nTokenYieldETH, nTokenYieldUSDC} = useAppContext();

    const fetchNTokenBalance = async (ccy) => {
        const nTokenBalance = await nTokenContract[ccy].balanceOf(account);
        setNTokenBalance(ccy, formatUnits(nTokenBalance, 18));
    };

    const fetchNTokenYield = async (ccy) => {
        const nTokenYield = await nTokenContract[ccy].getCurrentAPY();
        setNTokenYield(ccy, formatUnits(nTokenYield, 18));
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