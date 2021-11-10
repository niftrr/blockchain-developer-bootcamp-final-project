import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useContract } from "./useContract";
import AssetTokenData from "../../v1-core/artifacts/contracts/AssetToken.sol/AssetToken.json";
import { useAppContext } from "../AppContext";

export const useAssetToken = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();

    const assetTokenContractAddressDAI = "0x519b05b3655F4b89731B677d64CEcf761f4076f6"; // hardhat
    const assetTokenContractAddressETH = "0x057cD3082EfED32d5C907801BF3628B27D88fD80"; // hardhat
    const assetTokenContractAddressUSDC = "0xb6057e08a11da09a998985874FE2119e98dB3D5D"; // hardhat

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