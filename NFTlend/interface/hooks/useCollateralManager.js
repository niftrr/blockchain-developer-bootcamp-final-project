import { useContract } from "./useContract";
import CollateralManagerData from "../../v1-core/artifacts/contracts/CollateralManager.sol/CollateralManager.json";
import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useAppContext } from "../AppContext";

export const useCollateralManager = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();
    const collateralManagerContractAddress = "0xB22C255250d74B0ADD1bfB936676D2a299BF48Bd";
    const collateralManagerABI = CollateralManagerData["abi"];
    const collateralManagerContract = useContract(collateralManagerContractAddress, collateralManagerABI);
    
    const { setWhitelistNFT, whitelistNFT } = useAppContext();

    const fetchWhitelistNFT = async () => {
        const whitelist = collateralManagerContract.getWhitelist();
        setWhitelistNFT(whitelist);
    }

    return {
        fetchWhitelistNFT,
        whitelistNFT
    }
};

export default useCollateralManager;