import { useContract } from "./useContract";
import CollateralManagerData from "../../v1-core/artifacts/contracts/CollateralManager.sol/CollateralManager.json";
import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useAppContext } from "../AppContext";
import { formatUnits, parseUnits } from "@ethersproject/units";

export const useCollateralManager = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();
    const collateralManagerContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const collateralManagerABI = CollateralManagerData["abi"];
    const collateralManagerContract = useContract(collateralManagerContractAddress, collateralManagerABI);

    // NFT contract data (c&p from hooks/useNFT.js)
    const nftContractAddressPUNK = "0x09635F643e140090A9A8Dcd712eD6285858ceBef";
    const nftContractAddressBAYC = "0xc5a5C42992dECbae36851359345FE25997F5C42d";
    const nftContractAddress = {
        "PUNK": nftContractAddressPUNK,
        "BAYC": nftContractAddressBAYC
    }
    const nftContractAddressReverseLookup = {}
    nftContractAddressReverseLookup[nftContractAddressPUNK] = "PUNK";
    nftContractAddressReverseLookup[nftContractAddressBAYC] = "BAYC";

    const { 
        setWhitelistNFT, 
        whitelistNFT, 
        setAprPUNK, 
        setAprBAYC, 
        aprPUNK, 
        aprBAYC, 
        setBorrowAPR, 
        setUserBorrows } = useAppContext();

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

    const formatBorrow = async (_borrow) => {
        const borrow = {};
        borrow["erc20Token"] = _borrow["erc20Token"];
        borrow["maturity"] = _borrow["maturity"].toNumber();
        borrow["borrowAmount"] = formatUnits(_borrow["borrowAmount"].toString(),18)
        borrow["repaymentAmount"] = formatUnits(_borrow["repaymentAmount"].toString(),18)
        borrow["interestRate"] = _borrow["interestRate"].toString()
        borrow["liquidationPrice"] = formatUnits(_borrow["liquidationPrice"].toString(),18)
        borrow["nftSymbol"] = nftContractAddressReverseLookup[_borrow["collateral"][0]];
        borrow["nftTokenId"] = _borrow["collateral"][1].toNumber();
        return borrow;
    }

    const fetchUserBorrows = async () => {
        const userBorrowIds = await collateralManagerContract.getUserBorrows(account);
        console.log('userBorrowIds', userBorrowIds);
        const userBorrows = {};
        for (var borrowId in userBorrowIds) {
            let borrow = await collateralManagerContract.getBorrow(borrowId);
            // Exclude null addresses. TODO: check SC for an alternative to this patch.
            if (borrow[1] != "0x0000000000000000000000000000000000000000") { 
                userBorrows[borrowId] = await formatBorrow(borrow);
            } 
        }
        console.log('userBorrows', userBorrows);
        setUserBorrows(userBorrows);
    }

    return {
        fetchWhitelistNFT,
        whitelistNFT,
        fetchAPR,
        fetchBorrowAPR,
        collateralManagerContractAddress,
        fetchUserBorrows
    }
};

export default useCollateralManager;