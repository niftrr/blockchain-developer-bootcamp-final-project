import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useContract } from "./useContract";
import AssetTokenData from "../../v1-core/artifacts/contracts/AssetToken.sol/AssetToken.json";
import { useAppContext } from "../AppContext";

export const useAssetToken = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();

    const assetTokenContractAddressDAI = "0xed12bE400A07910E4d4E743E4ceE26ab1FC9a961"; // hardhat
    const assetTokenContractAddressETH = "0x1B25157F05B25438441bF7CDe38A95A55ccf8E50"; // hardhat
    const assetTokenContractAddressUSDC = "0xc775bF567D67018dfFac4E89a7Cf10f0EDd0Be93"; // hardhat

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