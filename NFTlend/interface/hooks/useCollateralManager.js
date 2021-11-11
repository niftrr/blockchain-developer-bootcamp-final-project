import { useContract } from "./useContract";
import CollateralManagerData from "../../v1-core/artifacts/contracts/CollateralManager.sol/CollateralManager.json";
import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useAppContext } from "../AppContext";
import { formatUnits, parseUnits } from "@ethersproject/units";

export const useCollateralManager = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();
    const collateralManagerContractAddress = "0x276C216D241856199A83bf27b2286659e5b877D3";
    const collateralManagerABI = CollateralManagerData["abi"];
    const collateralManagerContract = useContract(collateralManagerContractAddress, collateralManagerABI);

    // NFT contract data (c&p from hooks/useNFT.js)
    const nftContractAddressPUNK = "0x19cEcCd6942ad38562Ee10bAfd44776ceB67e923";
    const nftContractAddressBAYC = "0xD42912755319665397FF090fBB63B1a31aE87Cee";
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
        const userBorrows = {};
        for (var borrowId in userBorrowIds) {
            let borrow = await collateralManagerContract.getBorrow(borrowId);
            userBorrows[borrowId] = await formatBorrow(borrow);
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