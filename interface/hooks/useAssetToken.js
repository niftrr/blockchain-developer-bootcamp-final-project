import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useContract } from "./useContract";
import AssetTokenData from "../../v1-core/artifacts/contracts/mocks/AssetToken.sol/AssetToken.json";
import { useAppContext } from "../AppContext";

export const useAssetToken = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();

    const assetTokenContractAddressDAI = process.env.REACT_APP_ASSET_TOKEN_DAI_CONTRACT_ADDRESS;
    const assetTokenContractAddressETH = process.env.REACT_APP_ASSET_TOKEN_ETH_CONTRACT_ADDRESS;
    const assetTokenContractAddressUSDC = process.env.REACT_APP_ASSET_TOKEN_USDC_CONTRACT_ADDRESS;
    const assetTokenContractAddress = {
        "DAI": assetTokenContractAddressDAI,
        "ETH": assetTokenContractAddressETH,
        "USDC": assetTokenContractAddressUSDC
    }

    const assetTokenABI = AssetTokenData["abi"];
    const assetTokenContractDAI = useContract(assetTokenContractAddressDAI, assetTokenABI);
    const assetTokenContractETH = useContract(assetTokenContractAddressETH, assetTokenABI);
    const assetTokenContractUSDC = useContract(assetTokenContractAddressUSDC, assetTokenABI);

    const assetTokenContract = {
        "DAI": assetTokenContractDAI,
        "ETH": assetTokenContractETH,
        "USDC": assetTokenContractUSDC
    }

    return {
        assetTokenContract,
        assetTokenContractAddress
    }
};

export default useAssetToken;