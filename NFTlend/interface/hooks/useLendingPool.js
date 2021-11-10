import { useContract } from "./useContract";
import LendingPoolData from "../../v1-core/artifacts/contracts/LendingPool.sol/LendingPool.json";
import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useAppContext } from "../AppContext";
import useNToken from "./useNToken";
import useAssetToken from "./useAssetToken";
import { formatUnits, parseUnits } from "@ethersproject/units";

export const useLendingPool = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();
    const lendingPoolContractAddress = "0x89ec9355b1Bcc964e576211c8B011BD709083f8d";
    const lendingPoolABI = LendingPoolData["abi"];
    const lendingPoolContract = useContract(lendingPoolContractAddress, lendingPoolABI);
    
    const { setBorrowFloorPrice, borrowFloorPrice, setTxnStatus } = useAppContext();
    const { fetchNTokenBalance } = useNToken();
    const { assetTokenContract, assetTokenContractAddress } = useAssetToken();

    const fetchBorrowFloorPrice = async () => {
        const price = await lendingPoolContract._mockOracle();
        setBorrowFloorPrice(formatUnits(price, 0));
        console.log('fetchBorrowFloorPrice', price);
    };

    const deposit = async (tokenSymbol, amount) => {
        console.log('deposit called');
        if (account && isValidNetwork) {
            try {
                setTxnStatus("APPROVING");
                console.log('APPROVING');
                const tokenContract = assetTokenContract[tokenSymbol];
                await tokenContract.approve(lendingPoolContract.address, parseUnits(amount, 18)); // TODO: remove hard-coded decimals
                setTxnStatus("LOADING");
                console.log('LOADING');
                const tokenContractAddress = assetTokenContractAddress[tokenSymbol];
                const txn = await lendingPoolContract.deposit(tokenContractAddress, parseUnits(amount, 18)); // TODO: remove hard-coded decimals
                await txn.wait(1);
                await fetchNTokenBalance(tokenSymbol);
                setTxnStatus("COMPLETE");
                console.log('COMPLETE');
            } catch (error) {
                setTxnStatus("ERROR");
                console.log('ERROR', error);
            }
        }
    };

    return {
        fetchBorrowFloorPrice,
        borrowFloorPrice,
        deposit
    }
};

export default useLendingPool;