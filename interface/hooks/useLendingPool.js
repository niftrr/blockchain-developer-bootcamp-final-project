import { useContract } from "./useContract";
import { useWeb3React } from "@web3-react/core";
import useIsValidNetwork from "./useIsValidNetwork";
import { useAppContext } from "../AppContext";
import useNToken from "./useNToken";
import useDebtToken from "./useDebtToken";
import useNFT from "./useNFT";
import useAssetToken from "./useAssetToken";
import useCollateralManager from "./useCollateralManager";
import { formatUnits, parseUnits } from "@ethersproject/units";

const LendingPoolData = URL("../artifacts/contracts/LendingPool.sol/LendingPool.json", import.meta.url);

export const useLendingPool = () => {
    const { account } = useWeb3React();
    const { isValidNetwork } = useIsValidNetwork();
    const lendingPoolContractAddress = process.env.REACT_APP_LENDING_POOL_CONTRACT_ADDRESS;
    const lendingPoolABI = LendingPoolData["abi"];
    const lendingPoolContract = useContract(lendingPoolContractAddress, lendingPoolABI);
    
    const { setBorrowFloorPrice, borrowFloorPrice, setTxnStatus, borrowProject, borrowToken } = useAppContext();
    const { nTokenContract, fetchNTokenBalance } = useNToken();
    const { debtTokenContract, fetchDebtTokenBalance } = useDebtToken();
    const { assetTokenContract, assetTokenContractAddress } = useAssetToken();
    const { nftContract } = useNFT();
    const { collateralManagerContractAddress } = useCollateralManager();

    const assetTokenContractAddressSymbolLookup = {};
    assetTokenContractAddressSymbolLookup[process.env.REACT_APP_ASSET_TOKEN_DAI_CONTRACT_ADDRESS] = "DAI"; 
    assetTokenContractAddressSymbolLookup[process.env.REACT_APP_ASSET_TOKEN_USDC_CONTRACT_ADDRESS] = "USDC"; 
    assetTokenContractAddressSymbolLookup[process.env.REACT_APP_ASSET_TOKEN_WETH_CONTRACT_ADDRESS] = "WETH"; 
            
    function wait(seconds) {
        return new Promise( res => setTimeout(res, seconds*1000) );
    }

    const fetchBorrowFloorPrice = async () => {
        if (borrowProject != "--") { 
            const nftContractAddress = await nftContract[borrowProject].address;
            const assetTokenContractAddress = await assetTokenContract[borrowToken].address;
            // TODO update: second parameter should be assetToken (not currently used by SC)
            const price = await lendingPoolContract.getMockFloorPrice(nftContractAddress, assetTokenContractAddress); 
            setBorrowFloorPrice(formatUnits(price, 18));
        }
    };

    const deposit = async (tokenSymbol, amount) => {
        if (account && isValidNetwork) {
            try {
                setTxnStatus("LOADING");
                const tokenContract = assetTokenContract[tokenSymbol];
                const txn1 = await tokenContract.approve(lendingPoolContract.address, parseUnits(amount, 18)); // TODO: remove hard-coded decimals
                setTxnStatus("ACCEPTING");
                await txn1.wait(1);
                const tokenContractAddress = assetTokenContractAddress[tokenSymbol];
                const txn2 = await lendingPoolContract.deposit(tokenContractAddress, parseUnits(amount, 18)); // TODO: remove hard-coded decimals
                setTxnStatus("TRANSFERRING");
                await txn2.wait(1);
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
                const txn1 = await _nTokenContract.approve(lendingPoolContract.address, parseUnits(amount, 18)); // TODO: remove hard-coded decimals
                setTxnStatus("ACCEPTING");
                await txn1.wait(1);
                setTxnStatus("LOADING");
                const tokenContractAddress = assetTokenContractAddress[tokenSymbol];
                const txn2 = await lendingPoolContract.withdraw(tokenContractAddress, parseUnits(amount, 18)); // TODO: remove hard-coded decimals
                setTxnStatus("TRANSFERRING");
                await txn2.wait(1);
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
        numWeeks) => {
        if (account && isValidNetwork) {
            try {
                setTxnStatus("LOADING");
                const nftTokenContract = nftContract[nftTokenSymbol];
                const txn1 = await nftTokenContract.approve(collateralManagerContractAddress, nftTokenId);
                await txn1.wait(1);
                setTxnStatus("ACCEPTING");
                const tokenContractAddress = assetTokenContractAddress[tokenSymbol];
                const txn2 = await lendingPoolContract.borrow(
                    tokenContractAddress, 
                    parseUnits(tokenAmount, 18),
                    nftTokenContract.address,
                    nftTokenId,
                    numWeeks); // TODO: remove hard-coded decimals
                    setTxnStatus("TRANSFERRING");
                    await txn2.wait(1);
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
                const txn1 = await tokenContract.approve(_nTokenContract.address, parseUnits(tokenAmount, 18));
                setTxnStatus("ACCEPTING");
                await txn1.wait(1);
                const tokenContractAddress = assetTokenContractAddress[tokenSymbol];
                const txn2 = await lendingPoolContract.repay(
                    tokenContractAddress, 
                    parseUnits(tokenAmount, 18),
                    borrowId); // TODO: remove hard-coded decimals
                setTxnStatus("TRANSFERRING");
                await txn2.wait(1);
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

    const liquidate = async (
        tokenAddress, 
        tokenAmount,
        borrowId) => {        
        if (account && isValidNetwork) {
            try {
                setTxnStatus("LOADING");
                const tokenSymbol = assetTokenContractAddressSymbolLookup[tokenAddress];           
                const tokenContract = assetTokenContract[tokenSymbol];
                const txn1 = await tokenContract.approve(lendingPoolContract.address, parseUnits(tokenAmount.toString(), 18));
                setTxnStatus("ACCEPTING");
                await txn1.wait(1);
                const tokenContractAddress = assetTokenContractAddress[tokenSymbol];
                const txn2 = await lendingPoolContract.liquidate(
                    tokenContractAddress, 
                    parseUnits(tokenAmount.toString(), 18),
                    borrowId); // TODO: remove hard-coded decimals
                    setTxnStatus("TRANSFERRING");
                await txn2.wait(1);
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
        assetTokenContractAddressSymbolLookup,
        fetchBorrowFloorPrice,
        borrowFloorPrice,
        deposit,
        withdraw,
        borrow,
        repay,
        liquidate
    }
};

export default useLendingPool;