import { useContract } from "./useContract";
import CollateralManagerData from "../../v1-core/artifacts/contracts/CollateralManager.sol/CollateralManager.json";
import LendingPoolData from "../../v1-core/artifacts/contracts/LendingPool.sol/LendingPool.json";
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

    // LendingPool Contract
    const lendingPoolContractAddress = process.env.REACT_APP_LENDING_POOL_CONTRACT_ADDRESS;
    const lendingPoolABI = LendingPoolData["abi"];
    const lendingPoolContract = useContract(lendingPoolContractAddress, lendingPoolABI);

    const { 
        setWhitelistNFT, 
        whitelistNFT, 
        setAprPUNK, 
        setAprBAYC, 
        aprPUNK, 
        aprBAYC, 
        setBorrowAPR, 
        setUserBorrows,
        setBorrowDefaults,
        borrowFloorPrice 
    } = useAppContext();

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
        borrow["nftContractAddress"] = _borrow["collateral"][0];
        borrow["nftSymbol"] = nftContractAddressReverseLookup[borrow["nftContractAddress"]];
        borrow["nftTokenId"] = _borrow["collateral"][1].toNumber();
        return borrow;
    }

    const fetchUserBorrows = async () => {
        const userBorrowIds = await collateralManagerContract.getUserBorrowIds(account);
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

    const fetchDefaultedBorrows = async () => {
        const lastBorrowId = await collateralManagerContract.getLastBorrowId();
        const borrowDefaults = {};
        for (let i = 0; i <= lastBorrowId; i++) {
            let borrow = await collateralManagerContract.getBorrow(i);
            
            // Check if SC borrow is active and exclude null address (FE patch)
            if (borrow['status'] == 0 && borrow['borrower'] != "0x0000000000000000000000000000000000000000") { 
                
                let maturity = new Date(borrow['maturity'] * 1000);
                let now = new Date().getTime();

                let borrowFormatted = await formatBorrow(borrow);
                let floorPrice = formatUnits((await lendingPoolContract.getMockFloorPrice(borrowFormatted["nftContractAddress"], borrowFormatted["erc20Token"])).toString(), 18); 
                let borrowCollRatio = 100 * floorPrice / borrowFormatted['borrowAmount'];

                // if maturity expired or undercollateralized 
                // TODO: Update hard-coded below to take threshold from SC
                if (now > maturity || borrowCollRatio < 150 ) {
                    borrowDefaults[i] = borrowFormatted;
                    borrowDefaults[i]["collRatio"] = borrowCollRatio;
                    // 20% discount on the floor price. TODO: take discount from SC
                    borrowDefaults[i]["liquidationPrice"] = floorPrice * 0.8 
                }
            }
        }
        setBorrowDefaults(borrowDefaults);
    }

    return {
        fetchWhitelistNFT,
        whitelistNFT,
        fetchAPR,
        fetchBorrowAPR,
        collateralManagerContractAddress,
        fetchUserBorrows,
        fetchDefaultedBorrows
    }
};

export default useCollateralManager;