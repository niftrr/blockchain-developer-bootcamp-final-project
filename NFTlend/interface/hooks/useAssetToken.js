import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useContract } from "./useContract";
import AssetTokenData from "../../v1-core/artifacts/contracts/AssetToken.sol/AssetToken.json";
import { useAppContext } from "../AppContext";

export const useAssetToken = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();

    const assetTokenContractAddressDAI = "0x3155755b79aA083bd953911C92705B7aA82a18F9"; // hardhat
    const assetTokenContractAddressETH = "0x5bf5b11053e734690269C6B9D438F8C9d48F528A"; // hardhat
    const assetTokenContractAddressUSDC = "0xffa7CA1AEEEbBc30C874d32C7e22F052BbEa0429"; // hardhat

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