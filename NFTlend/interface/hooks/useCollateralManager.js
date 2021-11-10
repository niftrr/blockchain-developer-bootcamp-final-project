import { useContract } from "./useContract";
import CollateralManagerData from "../../v1-core/artifacts/contracts/CollateralManager.sol/CollateralManager.json";
import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useAppContext } from "../AppContext";
import { formatUnits } from "@ethersproject/units";

export const useCollateralManager = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();
    const collateralManagerContractAddress = "0x72662E4da74278430123cE51405c1e7A1B87C294";
    const collateralManagerABI = CollateralManagerData["abi"];
    const collateralManagerContract = useContract(collateralManagerContractAddress, collateralManagerABI);

    // NFT contract data (c&p from hooks/useNFT.js)
    const nftContractAddressPUNK = "0x4432a6DcfAEAB227673B43C30c6fEf40eaBD5D30";
    const nftContractAddressBAYC = "0x0B1a87021ec75fBaE919b1e86b2B1335FFC8F4d3";
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