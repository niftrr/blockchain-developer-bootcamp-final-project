import { useContract } from "./useContract";
import LendingPoolData from "../../v1-core/artifacts/contracts/LendingPool.sol/LendingPool.json";
import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useAppContext } from "../AppContext";
import useNToken from "./useNToken";
import useDebtToken from "./useDebtToken";
import useNFT from "./useNFT";
import useAssetToken from "./useAssetToken";
import useCollateralManager from "./useCollateralManager";
import { formatUnits, parseUnits } from "@ethersproject/units";

export const useLendingPool = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();
    const lendingPoolContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const lendingPoolABI = LendingPoolData["abi"];
    const lendingPoolContract = useContract(lendingPoolContractAddress, lendingPoolABI);
    
    const { setBorrowFloorPrice, borrowFloorPrice, setTxnStatus } = useAppContext();
    const { nTokenContract, fetchNTokenBalance } = useNToken();
    const { debtTokenContract, fetchDebtTokenBalance } = useDebtToken();
    const { assetTokenContract, assetTokenContractAddress } = useAssetToken();
    const { nftContract } = useNFT();
    const { collateralManagerContractAddress } = useCollateralManager();

    const assetTokenContractAddressSymbolLookup = {};
    assetTokenContractAddressSymbolLookup["0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"] = "DAI"; //hardhat
    assetTokenContractAddressSymbolLookup["0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"] = "ETH"; //hardhat
    assetTokenContractAddressSymbolLookup["0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"] = "USDC"; //hardhat
            

    function wait(seconds) {
        return new Promise( res => setTimeout(res, seconds*1000) );
    }

    const fetchBorrowFloorPrice = async () => {
        const price = await lendingPoolContract._mockOracle();
        setBorrowFloorPrice(formatUnits(price, 0));
        console.log('fetchBorrowFloorPrice', price);
    };

    const deposit = async (tokenSymbol, amount) => {
        if (account && isValidNetwork) {
            try {
                setTxnStatus("LOADING");
                const tokenContract = assetTokenContract[tokenSymbol];
                await tokenContract.approve(lendingPoolContract.address, parseUnits(amount, 18)); // TODO: remove hard-coded decimals
                setTxnStatus("LOADING");
                const tokenContractAddress = assetTokenContractAddress[tokenSymbol];
                const txn = await lendingPoolContract.deposit(tokenContractAddress, parseUnits(amount, 18)); // TODO: remove hard-coded decimals
                await txn.wait(1);
                await fetchNTokenBalance(tokenSymbol);
                setTxnStatus("COMPLETE");
                await wait(10);
                setTxnStatus("");
            } catch (error) {
                setTxnStatus("ERROR");
                console.log('ERROR', error);
                await wait(10);
                setTxnStatus("");
            }
        }
    };

    const withdraw = async (tokenSymbol, amount) => {
        if (account && isValidNetwork) {
            try {
                setTxnStatus("LOADING");
                const _nTokenContract = nTokenContract[tokenSymbol];
                await _nTokenContract.approve(lendingPoolContract.address, parseUnits(amount, 18)); // TODO: remove hard-coded decimals
                setTxnStatus("LOADING");
                const tokenContractAddress = assetTokenContractAddress[tokenSymbol];
                const txn = await lendingPoolContract.withdraw(tokenContractAddress, parseUnits(amount, 18)); // TODO: remove hard-coded decimals
                await txn.wait(1);
                await fetchNTokenBalance(tokenSymbol);
                setTxnStatus("COMPLETE");
                await wait(10);
                setTxnStatus("");
            } catch (error) {
                setTxnStatus("ERROR");
                console.log('ERROR', error);
                await wait(10);
                setTxnStatus("");
            }
        }
    };

    const borrow = async (
        tokenSymbol, 
        tokenAmount,
        nftTokenSymbol,
        nftTokenId,
        interestRate,
        numWeeks) => {
        if (account && isValidNetwork) {
            try {
                setTxnStatus("LOADING");
                const nftTokenContract = nftContract[nftTokenSymbol];
                await nftTokenContract.approve(collateralManagerContractAddress, nftTokenId);
                setTxnStatus("LOADING");
                const tokenContractAddress = assetTokenContractAddress[tokenSymbol];
                const txn = await lendingPoolContract.borrow(
                    tokenContractAddress, 
                    parseUnits(tokenAmount, 18),
                    nftTokenContract.address,
                    nftTokenId,
                    interestRate,
                    numWeeks); // TODO: remove hard-coded decimals
                await txn.wait(1);
                await fetchDebtTokenBalance(tokenSymbol);
                setTxnStatus("COMPLETE");
                await wait(10);
                setTxnStatus("");
            } catch (error) {
                setTxnStatus("ERROR");
                console.log('ERROR', error);
                await wait(10);
                setTxnStatus("");
            }
        }
    };

    const repay = async (
        tokenAddress, 
        tokenAmount,
        borrowId) => {        
        if (account && isValidNetwork) {
            try {
                setTxnStatus("LOADING");
                const tokenSymbol = assetTokenContractAddressSymbolLookup[tokenAddress];           
                const tokenContract = assetTokenContract[tokenSymbol];
                const _nTokenContract = nTokenContract[tokenSymbol];
                await tokenContract.approve(_nTokenContract.address, parseUnits(tokenAmount, 18));
                setTxnStatus("LOADING");
                const tokenContractAddress = assetTokenContractAddress[tokenSymbol];
                const txn = await lendingPoolContract.repay(
                    tokenContractAddress, 
                    parseUnits(tokenAmount, 18),
                    borrowId); // TODO: remove hard-coded decimals
                
                await txn.wait(1);
                await fetchDebtTokenBalance(tokenSymbol);
                setTxnStatus("COMPLETE");
                await wait(10);
                setTxnStatus("");
            } catch (error) {
                setTxnStatus("ERROR");
                console.log('ERROR', error);
                await wait(10);
                setTxnStatus("");
            }
        }
    };

    return {
        fetchBorrowFloorPrice,
        borrowFloorPrice,
        deposit,
        withdraw,
        borrow,
        repay
    }
};

export default useLendingPool;