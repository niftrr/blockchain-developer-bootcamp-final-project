import { useContract } from "./useContract";
import CollateralManagerData from "../../v1-core/artifacts/contracts/CollateralManager.sol/CollateralManager.json";
import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useAppContext } from "../AppContext";
import { formatUnits, parseUnits } from "@ethersproject/units";

export const useCollateralManager = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();
    const collateralManagerContractAddress = process.env.REACT_APP_COLLATERAL_MANAGER_CONTRACT_ADDRESS;
    const collateralManagerABI = CollateralManagerData["abi"];
    const collateralManagerContract = useContract(collateralManagerContractAddress, collateralManagerABI);

    // NFT contract data (c&p from hooks/useNFT.js)
    const nftContractAddressPUNK = process.env.REACT_APP_NFT_PUNK_CONTRACT_ADDRESS;
    const nftContractAddressBAYC = process.env.REACT_APP_NFT_BAYC_CONTRACT_ADDRESS;
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
        const userBorrows = {};
        for (var borrowId in userBorrowIds) {
            let borrow = await collateralManagerContract.getBorrow(borrowId);
            // Exclude null addresses. TODO: check SC for an alternative to this patch.
            if (borrow[1] != "0x0000000000000000000000000000000000000000") { 
                userBorrows[borrowId] = await formatBorrow(borrow);
            } 
        }
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