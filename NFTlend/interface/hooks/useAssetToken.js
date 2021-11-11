import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useContract } from "./useContract";
import AssetTokenData from "../../v1-core/artifacts/contracts/AssetToken.sol/AssetToken.json";
import { useAppContext } from "../AppContext";

export const useAssetToken = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();

    const assetTokenContractAddressDAI = "0x0b5dcAf621a877dAcF3C540c1e5208C8a3eb7B23"; // hardhat
    const assetTokenContractAddressETH = "0x9a8164cA007ff0899140719E9aEC9a9C889CbF1E"; // hardhat
    const assetTokenContractAddressUSDC = "0xA3E5DfE71aE3e6DeC4D98fa28821dF355d7244B3"; // hardhat

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