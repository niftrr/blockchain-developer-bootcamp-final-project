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
    const nTokenContractAddressDAI = "0xad203b3144f8c09a20532957174fc0366291643c"; // hardhat
    const nTokenContractAddressETH = "0x31403b1e52051883f2Ce1B1b4C89f36034e1221D"; // hardhat
    const nTokenContractAddressUSDC = "0x4278C5d322aB92F1D876Dd7Bd9b44d1748b88af2"; // hardhat
    // AssetTokens
    const assetTokenContractAddressDAI = "0x519b05b3655F4b89731B677d64CEcf761f4076f6"; // hardhat
    const assetTokenContractAddressETH = "0x057cD3082EfED32d5C907801BF3628B27D88fD80"; // hardhat
    const assetTokenContractAddressUSDC = "0xb6057e08a11da09a998985874FE2119e98dB3D5D"; // hardhat
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