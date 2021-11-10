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
    const nTokenContractAddressDAI = "0x3489745eff9525CCC3d8c648102FE2cf3485e228"; // hardhat
    const nTokenContractAddressETH = "0x43b9Ef43D415e84aD9964567002d648b11747A8f"; // hardhat
    const nTokenContractAddressUSDC = "0xFCa5Bb3732185AE6AaFC65aD8C9A4fBFf21DbaaD"; // hardhat
    // AssetTokens
    const assetTokenContractAddressDAI = "0xed12bE400A07910E4d4E743E4ceE26ab1FC9a961"; // hardhat
    const assetTokenContractAddressETH = "0x1B25157F05B25438441bF7CDe38A95A55ccf8E50"; // hardhat
    const assetTokenContractAddressUSDC = "0xc775bF567D67018dfFac4E89a7Cf10f0EDd0Be93"; // hardhat
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
        assetTokenContractAddress
    }
};

export default useNToken;