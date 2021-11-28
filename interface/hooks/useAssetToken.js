import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useContract } from "./useContract";
import { useAppContext } from "../AppContext";
import { formatUnits } from "@ethersproject/units";
import AssetTokenData from "../../v1-core/artifacts/contracts/mocks/AssetToken.sol/AssetToken.json";


export const useAssetToken = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();
    const {setAssetTokenBalanceDAI, setAssetTokenBalanceWETH, setAssetTokenBalanceUSDC} = useAppContext();

    const assetTokenContractAddressDAI = process.env.REACT_APP_ASSET_TOKEN_DAI_CONTRACT_ADDRESS;
    const assetTokenContractAddressUSDC = process.env.REACT_APP_ASSET_TOKEN_USDC_CONTRACT_ADDRESS;
    const assetTokenContractAddressWETH = process.env.REACT_APP_ASSET_TOKEN_WETH_CONTRACT_ADDRESS;
    const assetTokenContractAddress = {
        "DAI": assetTokenContractAddressDAI,
        "USDC": assetTokenContractAddressUSDC,
        "WETH": assetTokenContractAddressWETH
    }

    const assetTokenABI = AssetTokenData["abi"];
    const assetTokenContractDAI = useContract(assetTokenContractAddressDAI, assetTokenABI);
    const assetTokenContractUSDC = useContract(assetTokenContractAddressUSDC, assetTokenABI);
    const assetTokenContractWETH = useContract(assetTokenContractAddressWETH, assetTokenABI);

    const assetTokenContract = {
        "DAI": assetTokenContractDAI,
        "USDC": assetTokenContractUSDC,
        "WETH": assetTokenContractWETH
    }

    const fetchAssetTokenBalances = async () => {
        const tokenBalanceDAI = await assetTokenContractDAI.balanceOf(account);
        setAssetTokenBalanceDAI(formatUnits(tokenBalanceDAI, 18));

        const tokenBalanceUSDC = await assetTokenContractUSDC.balanceOf(account);
        setAssetTokenBalanceUSDC(formatUnits(tokenBalanceUSDC, 18));

        const tokenBalanceWETH = await assetTokenContractWETH.balanceOf(account);
        setAssetTokenBalanceWETH(formatUnits(tokenBalanceWETH, 18));
    }

    return {
        assetTokenContract,
        assetTokenContractAddress,
        fetchAssetTokenBalances
    }
};

export default useAssetToken;