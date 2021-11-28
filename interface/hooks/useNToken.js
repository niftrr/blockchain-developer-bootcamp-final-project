import { useContract } from "./useContract";
import useIsValidNetwork from "../hooks/useIsValidNetwork";
import { useWeb3React } from "@web3-react/core";
import { useAppContext } from "../AppContext";
import { formatUnits } from "@ethersproject/units";

const NTokenData =URL( "../../v1-core/artifacts/contracts/Ntoken.sol/NToken.json", import.meta.url);

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
        nTokenYieldDAI, nTokenYieldWETH, nTokenYieldUSDC,
        setNTokenSupplyDAI, setNTokenSupplyUSDC, setNTokenSupplyWETH} = useAppContext();

    const fetchNTokenBalance = async () => {
        const nTokenBalanceDAI = await nTokenContractDAI.balanceOf(account);
        setNTokenBalanceDAI(formatUnits(nTokenBalanceDAI, 18));

        const nTokenBalanceUSDC = await nTokenContractUSDC.balanceOf(account);
        setNTokenBalanceUSDC(formatUnits(nTokenBalanceUSDC, 18));

        const nTokenBalanceWETH = await nTokenContractWETH.balanceOf(account);
        setNTokenBalanceWETH(formatUnits(nTokenBalanceWETH, 18));
    };

    const fetchNTokenYield = async () => {
        const nTokenYieldDAI = await nTokenContractDAI.getCurrentAPY();
        setNTokenYieldDAI(formatUnits(nTokenYieldDAI, 18));

        const nTokenYieldUSDC = await nTokenContractUSDC.getCurrentAPY();
        setNTokenYieldUSDC(formatUnits(nTokenYieldUSDC, 18));
    
        const nTokenYieldWETH = await nTokenContractWETH.getCurrentAPY();
        setNTokenYieldWETH(formatUnits(nTokenYieldWETH, 18));
    };

    const fetchNTokenSupply = async () => {
        const nTokenSupplyDAI = await nTokenContractDAI.totalSupply();
        setNTokenSupplyDAI(formatUnits(nTokenSupplyDAI, 18));

        const nTokenSupplyUSDC = await nTokenContractUSDC.totalSupply();
        setNTokenSupplyUSDC(formatUnits(nTokenSupplyUSDC, 18));

        const nTokenSupplyWETH = await nTokenContractWETH.totalSupply();
        setNTokenSupplyWETH(formatUnits(nTokenSupplyWETH, 18));
    }

    return {
        fetchNTokenBalance,
        fetchNTokenYield,
        fetchNTokenSupply,
        assetTokenContractAddress,
        nTokenContract
    }
};

export default useNToken;