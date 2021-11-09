import { useContract } from "./useContract";
import LendingPoolData from "../../v1-core/artifacts/contracts/LendingPool.sol/LendingPool.json";
import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useAppContext } from "../AppContext";
import { formatUnits } from "@ethersproject/units";

export const useLendingPool = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();
    const lendingPoolContractAddress = "0x00CAC06Dd0BB4103f8b62D280fE9BCEE8f26fD59";
    const lendingPoolABI = LendingPoolData["abi"];
    const lendingPoolContract = useContract(lendingPoolContractAddress, lendingPoolABI);
    
    const { setBorrowFloorPrice, borrowFloorPrice } = useAppContext();

    const fetchBorrowFloorPrice = async () => {
        const price = await lendingPoolContract._mockOracle();
        setBorrowFloorPrice(formatUnits(price, 0));
        console.log('fetchBorrowFloorPrice', price);
    }

    return {
        fetchBorrowFloorPrice,
        borrowFloorPrice
    }
};

export default useLendingPool;