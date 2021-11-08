import { useContract } from "./useContract";
import NTokenData from "../../v1-core/artifacts/contracts/Ntoken.sol/NToken.json";
import useIsValidNetwork from "../hooks/useIsValidNetwork";
import { useWeb3React } from "@web3-react/core";
import { useAppContext } from "../AppContext";
import { formatUnits } from '@ethersproject/units';
import { useEffect } from "react";

export const useNToken = () => {
    console.log('useNToken');
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();
    const nTokenContractAddressDAI = '0x809d550fca64d94Bd9F66E60752A544199cfAC3D' // hardhat
    const nTokenContractAddressETH = '0x4c5859f0F772848b2D91F1D83E2Fe57935348029' // hardhat
    const nTokenContractAddressUSDC = '0x1291Be112d480055DaFd8a610b7d1e203891C274' // hardhat
    const nTokenABI = NTokenData["abi"];
    const nTokenContractDAI = useContract(nTokenContractAddressDAI, nTokenABI);
    const nTokenContractETH = useContract(nTokenContractAddressETH, nTokenABI);
    const nTokenContractUSDC = useContract(nTokenContractAddressUSDC, nTokenABI);
    const nTokenContract = {
        'DAI': nTokenContractDAI,
        'ETH': nTokenContractETH,
        'USDC': nTokenContractUSDC
    }
    const {setNTokenBalance, setNTokenYield, setTxnStatus, 
        nTokenBalanceDAI, nTokenBalanceETH, nTokenBalanceUSDC,
        nTokenYieldDAI, nTokenYieldETH, nTokenYieldUSDC} = useAppContext();

    const fetchNTokenBalance = async (ccy) => {
        const nTokenBalance = await nTokenContract[ccy].balanceOf(account);
        setNTokenBalance(ccy, formatUnits(nTokenBalance, 18));
    };

    const fetchNTokenYield = async (ccy) => {
        // const nTokenYield = await nTokenContract[ccy].balanceOf(account);
        // setNTokenYield(ccy, formatUnits(nTokenYield, 18));
        setNTokenYield(ccy, 20);
    };

    return {
        nTokenBalanceDAI,
        nTokenBalanceETH,
        nTokenBalanceUSDC,
        fetchNTokenBalance,
        nTokenYieldDAI,
        nTokenYieldETH,
        nTokenYieldUSDC,
        fetchNTokenYield
    }
};

export default useNToken;