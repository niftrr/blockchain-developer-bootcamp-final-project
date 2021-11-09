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
    const nTokenContractAddressDAI = "0xCa57C1d3c2c35E667745448Fef8407dd25487ff8"; // hardhat
    const nTokenContractAddressETH = "0xc3023a2c9f7B92d1dd19F488AF6Ee107a78Df9DB"; // hardhat
    const nTokenContractAddressUSDC = "0x124dDf9BdD2DdaD012ef1D5bBd77c00F05C610DA"; // hardhat

    const nTokenContractAddress = {
        "DAI": nTokenContractAddressDAI,
        "ETH": nTokenContractAddressETH,
        "USDC": nTokenContractAddressUSDC
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
        fetchNTokenYield
    }
};

export default useNToken;