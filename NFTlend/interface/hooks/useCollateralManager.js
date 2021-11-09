import { useContract } from "./useContract";
import CollateralManagerData from "../../v1-core/artifacts/contracts/CollateralManager.sol/CollateralManager.json";
import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useAppContext } from "../AppContext";
import { formatUnits } from "@ethersproject/units";

export const useCollateralManager = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();
    const collateralManagerContractAddress = "0xB7ca895F81F20e05A5eb11B05Cbaab3DAe5e23cd";
    const collateralManagerABI = CollateralManagerData["abi"];
    const collateralManagerContract = useContract(collateralManagerContractAddress, collateralManagerABI);

    // NFT contract data (c&p from hooks/useNFT.js)
    const nftContractAddressPUNK = "0x09120eAED8e4cD86D85a616680151DAA653880F2";
    const nftContractAddressBAYC = "0x3E661784267F128e5f706De17Fac1Fc1c9d56f30";
    const nftContractAddress = {
        "PUNK": nftContractAddressPUNK,
        "BAYC": nftContractAddressBAYC
    }
    
    const { setWhitelistNFT, whitelistNFT, setAprPUNK, setAprBAYC, aprPUNK, aprBAYC, setBorrowAPR } = useAppContext();

    const fetchWhitelistNFT = async () => {
        const whitelist = await collateralManagerContract.getWhitelist();
        setWhitelistNFT(whitelist);
        console.log(whitelist);
    }

    const fetchAPR = async () => {
        const aprPUNK = await collateralManagerContract.getInterestRate(nftContractAddress["PUNK"]);
        const aprBAYC = await collateralManagerContract.getInterestRate(nftContractAddress["BAYC"]);
        setAprPUNK(formatUnits(aprPUNK, 0));
        setAprBAYC(formatUnits(aprBAYC, 0));
    }

    const fetchBorrowAPR = async (nftSymbol) => {
        if (nftSymbol == "PUNK") {
            setBorrowAPR(aprPUNK);
        } else if (nftSymbol == "BAYC") {
            setBorrowAPR(aprBAYC);
        }
    }

    return {
        fetchWhitelistNFT,
        whitelistNFT,
        fetchAPR,
        fetchBorrowAPR
    }
};

export default useCollateralManager;