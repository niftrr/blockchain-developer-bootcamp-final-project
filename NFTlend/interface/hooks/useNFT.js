import { useContract } from "./useContract";
import NFTData from "../../v1-core/artifacts/contracts/NFT.sol/NFT.json";
import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useAppContext } from "../AppContext";

export const useNFT = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();
    const nftContractAddressPUNK = "0x103A3b128991781EE2c8db0454cA99d67b257923";
    const nftContractAddressBAYC = "0xBbc18b580256A82dC0F9A86152b8B22E7C1C8005";
    const nftContractABI = NFTData["abi"];
    const nftContractPUNK = useContract(nftContractAddressPUNK, nftContractABI);
    const nftContractBAYC = useContract(nftContractAddressBAYC, nftContractABI);
    const nftContract = {
        "PUNK": nftContractPUNK,
        "BAYC": nftContractBAYC
    }
    const { setImageDict, imageDictPUNK, imageDictBAYC,
        borrowProject } = useAppContext();

    const nftAddressSymbolDict = {}
    nftAddressSymbolDict[nftContractAddressPUNK] = "PUNK";
    nftAddressSymbolDict[nftContractAddressBAYC] = "BAYC";

    const fetchImagesPUNK = async () => {
        const imageDict = {};
        for (var tokenId = 0; tokenId < 6; tokenId++) { // NOTE: Only 6 minted as per scripts/deploy.js 
            const owner = await nftContract["PUNK"].ownerOf(tokenId);
            if (owner==account) {
                let paddedTokenId = tokenId.toString().padStart(4, '0');
                let imageURL = `https://larvalabs.com/public/images/cryptopunks/punk${paddedTokenId}.png`; 
                imageDict[tokenId] = imageURL;
            }
        }
        setImageDict("PUNK", imageDict);
    }

    const fetchImagesBAYC = async () => {
        const imageDict = {};
        for (var tokenId = 0; tokenId < 6; tokenId++) { // NOTE: Only 6 minted as per scripts/deploy.js 
            const owner = await nftContract["BAYC"].ownerOf(tokenId);
            if (owner==account) {
                let response = await fetch(`https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/${tokenId}`);
                let data = await response.json();
                let imageIPFS = data["image"];
                let imageURL = `https://ipfs.io/ipfs/${imageIPFS.split("//")[1]}`;
                imageDict[tokenId] = imageURL;
            }
        }
        setImageDict("BAYC", imageDict);
    }

    const fetchImagesBorrow = async () => {
        console.log('fetchImagesBorrow borrowProject', borrowProject);
        const imageDict = {}
        if (borrowProject == "PUNK") {
            imageDict = imageDictPUNK;
            console.log("PUNK-");
        } 
        // else if (borrowProject == "BAYC") {
        //     imageDict = imageDictBAYC;
        //     console.log("BAYC-");
        // }
        setImageDict("BORROW", imageDict);
    }

    return {
        fetchImagesPUNK,
        fetchImagesBAYC,
        fetchImagesBorrow,
        imageDictPUNK,
        imageDictBAYC,
        nftAddressSymbolDict
    }
};

export default useNFT;