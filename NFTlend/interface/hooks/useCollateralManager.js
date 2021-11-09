import { useContract } from "./useContract";
import CollateralManagerData from "../../v1-core/artifacts/contracts/CollateralManager.sol/CollateralManager.json";
import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useAppContext } from "../AppContext";

export const useCollateralManager = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();
    const collateralManagerContractAddress = "0x4951A1C579039EbfCBA0BE33D2cd3A6D30b0f802";
    const collateralManagerABI = CollateralManagerData["abi"];
    const collateralManagerContract = useContract(collateralManagerContractAddress, collateralManagerABI);
    
    const { setWhitelistNFT, whitelistNFT } = useAppContext();

    const fetchWhitelistNFT = async () => {
        const whitelist = await collateralManagerContract.getWhitelist();
        setWhitelistNFT(whitelist);
        console.log(whitelist);
    }

    // const fetchAPR = async () => {
    //     const aprPUNK = await collateralManagerContract.getInterestRate();
    //     const aprBAYC = await collateralManagerContract.getInterestRate();
    //     setAPR("PUNK", aprPUNK);
    //     setAPR("BAYC", aprBAYC);
    //     console.log('aprPUNK', aprPUNK);
    //     console.log('aprBAYC', aprBAYC);
    // }

    return {
        fetchWhitelistNFT,
        whitelistNFT
    }
};

export default useCollateralManager;