import "./App.css";
import React, { useEffect, useState } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import PopUpNFTs from "./components/PopUpNFTs";
import Dashboard from "./components/Dashboard";
import PopUpTokensDeposit from "./components/PopUpTokensDeposit";
import PopUpTokensWithdraw from "./components/PopUpTokensWithdraw";
import PopUpBorrow from "./components/PopUpBorrow";
import Lend2 from "./components/Lend2";
import Borrow2 from "./components/Borrow2";
import LandingPage from "./components/LandingPage";
import Liquidate from "./components/Liquidate";
import Asset from "./components/Asset";
import { Web3ReactProvider } from "@web3-react/core"
import { ethers } from "ethers";
import NFTlendV1LendingPool from '../v1-core/artifacts/contracts/LendingPool.sol/LendingPool.json'
import { AppContextProvider } from './AppContext';

function getLibrary(provider) {
    return new ethers.providers.Web3Provider(provider);
  }

function App(props) {
  return (
    <AppContextProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
            <Router>
            <Switch>
                <Route path="/popupnfts">
                <PopUpNFTs popUpNFTProps={popUpNFTsData.popUpNFTProps} />
                </Route>
                <Route path="/dashboard">
                <Dashboard lendsProps={dashboardData.lendsProps} />
                </Route>
                <Route path="/popuptokensdeposit">
                <PopUpTokensDeposit popUpProps={popUpTokensDepositData.popUpProps} />
                </Route>
                <Route path="/popuptokenswithdraw">
                <PopUpTokensWithdraw popUpProps={popUpTokensWithdrawData.popUpProps} />
                </Route>
                <Route path="/popupborrow">
                <PopUpBorrow {...popUpBorrowData} />
                </Route>
                <Route path="/lend">
                <Lend2 headerProps={lend22Data.headerProps} lendsProps={lend22Data.lendsProps}/>
                </Route>
                <Route path="/borrow">
                <Borrow2 {...borrow22Data} />
                </Route>
                <Route path="/:path(|landing-page)">
                <LandingPage
                    text17="The NFT Liquidity Protocol"
                    text18="NFTlend.xyz is an open-source, non-custodial liquidity protocol for borrowing assets using NFTs as collateral and earning interest on deposits."
                    backgroundProps={landingPageData.backgroundProps}
                    buttonConnectWalletProps={landingPageData.buttonConnectWalletProps}
                    headerProps={landingPageData.headerProps}
                />
                </Route>
                <Route path="/liquidate">
                <Liquidate
                    headerProps={liquidateData.headerProps}
                    liquidate2Props={liquidateData.liquidate2Props}
                    liquidate22Props={liquidateData.liquidate22Props}
                    liquidate23Props={liquidateData.liquidate23Props}
                />
                </Route>
                <Route path="/asset">
                <Asset {...assetData} />
                </Route>
            </Switch>
            </Router>
        </Web3ReactProvider>
    </AppContextProvider>
  );
}

export default App;
const popUpNFTData = {
    spanText: <>Repay borrow.<br /></>,
    spanText2: <><br />Repay borrow to retreive your NFT.</>,
    nftAvatar: "/img/nft-avatar@2x.png",
    rectangle19: "/img/rectangle-19@2x.png",
    inputType: "text",
    inputPlaceholder: "1.9111",
    repay: "Repay",
};

const popUpNFTsData = {
    popUpNFTProps: popUpNFTData,
};

const buttonBorrowData = {
    children: "Borrow",
    className: "",
};

const buttonRepay22Data = {
    children: "Repay",
};

const buttonDepositData = {
    children: "Deposit",
    className: "",
};

const buttonWithdrawData = {
    children: "Withdraw",
    className: "",
};

const lendData = {
    buttonBorrowProps: buttonBorrowData,
    buttonRepayProps: buttonRepay22Data,
    buttonDepositProps: buttonDepositData,
    buttonWithdrawProps: buttonWithdrawData,
};

const buttonBorrow2Data = {
    children: "Deposit",
};

const buttonRepay23Data = {
    children: "Withdraw",
};

const lend2Data = {
    buttonBorrowProps: buttonBorrow2Data,
    buttonRepayProps: buttonRepay23Data,
};

const buttonBorrow3Data = {
    children: "Deposit",
};

const buttonRepay24Data = {
    children: "Withdraw",
};

const lend3Data = {
    buttonBorrowProps: buttonBorrow3Data,
    buttonRepayProps: buttonRepay24Data,
};

const lendsData = {
    lendProps: lendData,
    lend2Props: lend2Data,
    lend3Props: lend3Data,
};

const dashboardData = {
    lendsProps: lendsData,
};

const popUpDepositData = {
    x: "X",
    spanText: <>How much would you like to deposit?<br /></>,
    spanText2: <><br />Please enter an amount you would like to deposit.</>,
    rectangle19: "/img/rectangle-19@2x.png",
    inputType: "text",
    inputPlaceholder: "0.0000",
    name: "MAX",
    place: "Deposit",
};

const popUpWithdrawData = {
    x: "X",
    spanText: <>How much would you like to withdraw?<br /></>,
    spanText2: <><br />Please enter an amount you would like to withdraw.</>,
    rectangle19: "/img/rectangle-19@2x.png",
    inputType: "text",
    inputPlaceholder: "0.0000",
    name: "MAX",
    place: "Withdraw",
};

const borrowDataFloorPriceData = {
    borrowAmount: "Borrow Amount:",
    address: "60 WETH",
};

const borrowDataFloorPrice2Data = {
    borrowAmount: "Maturity:",
    address: "4 Weeks",
    className: "borrow-data-coll-ratio-1-1",
};

const borrowDataFloorPrice3Data = {
    borrowAmount: "Repayment Amount:",
    address: "65.6726",
    className: "borrow-data-coll-ratio-1",
};

const popUpBorrowData = {
    spanText: <>Confirm borrow.<br /></>,
    spanText2: <><br />Please confirm borrow to access instant liquidity.</>,
    nftAvatar: "/img/nft-avatar@2x.png",
    collateral: "Collateral:",
    fidenza157: "Fidenza #157",
    text1: "Collateralization Ratio:",
    percent: "200%",
    borrow: "Borrow",
    borrowDataFloorPriceProps: borrowDataFloorPriceData,
    borrowDataFloorPrice2Props: borrowDataFloorPrice2Data,
    borrowDataFloorPrice3Props: borrowDataFloorPrice3Data,
};

const popUpTokensDepositData = {
    popUpProps: popUpDepositData,
};

const popUpTokensWithdrawData = {
    popUpProps: popUpWithdrawData,
};

const header2Data = {
    className: "header-1",
};

const buttonBorrow4Data = {
    children: "Deposit",
    className: "button-deposit-1",
};

const buttonRepay25Data = {
    children: "Withdraw",
    className: "button-withdraw-1",
};

const lend4Data = {
    buttonBorrowProps: buttonBorrow4Data,
    buttonRepayProps: buttonRepay25Data,
};

const buttonBorrow5Data = {
    children: "Deposit",
    className: "button-deposit-2",
};

const buttonRepay26Data = {
    children: "Withdraw",
    className: "button-withdraw-1",
};

const lend5Data = {
    buttonBorrowProps: buttonBorrow5Data,
    buttonRepayProps: buttonRepay26Data,
};

const buttonBorrow6Data = {
    children: "Deposit",
    className: "button-deposit-1",
};

const buttonRepay27Data = {
    children: "Withdraw",
    className: "button-withdraw-1",
};

const lend6Data = {
    buttonBorrowProps: buttonBorrow6Data,
    buttonRepayProps: buttonRepay27Data,
};

const lends2Data = {
    className: "lends-1",
    lendProps: lend4Data,
    lend2Props: lend5Data,
    lend3Props: lend6Data,
};

const lend22Data = {
    headerProps: header2Data,
    lendsProps: lends2Data,
};

const header3Data = {
    className: "header-2",
};

const itemProject2Data = {
    className: "item-project-1",
};

const itemProject3Data = {
    className: "item-project-2",
};

const itemNFTData = {
    rectangle32: "/img/rectangle-32@2x.png",
    fidenza157: <>Fidenza<br />#157</>,
};

const inputDropdownData = {
    className: "",
};

const borrowTokenData = {
    token: "Token:",
    inputDropdownProps: inputDropdownData,
};

const inputTextData = {
    children: "65.4210",
};

const inputDropdown2Data = {
    className: "input-dropdown-1",
};

const borrowToken2Data = {
    token: "Maturity:",
    className: "borrow-maturity",
    inputDropdownProps: inputDropdown2Data,
};

const buttonBorrow7Data = {
    children: "Borrow",
    className: "button-borrow",
};

const borrowDataCollRatioData = {
    maturity: "Repayment Amount:",
    d: "65.6726",
};

const borrowDataCollRatio2Data = {
    collateralRatio: "APR",
    percent: "20%",
};

const borrowDataCollRatio22Data = {
    collateralRatio: "Collateralization Ratio:",
    percent: "200%",
    className: "borrow-data-coll-ratio-3",
};

const borrowDataCollRatio3Data = {
    maturity: "Collateral:",
    d: "Fidenza #157",
    className: "borrow-data-collateral",
};

const borrow22Data = {
    nftAvatar: "/img/nft-avatar-1@2x.png",
    amount: "Amount:",
    text15: "Current Floor Price:",
    address: "120 WETH",
    headerProps: header3Data,
    itemProjectProps: itemProject2Data,
    itemProject2Props: itemProject3Data,
    itemNFTProps: itemNFTData,
    borrowTokenProps: borrowTokenData,
    inputTextProps: inputTextData,
    borrowToken2Props: borrowToken2Data,
    buttonBorrowProps: buttonBorrow7Data,
    borrowDataCollRatioProps: borrowDataCollRatioData,
    borrowDataCollRatio2Props: borrowDataCollRatio2Data,
    borrowDataCollRatio22Props: borrowDataCollRatio22Data,
    borrowDataCollRatio2Props2: borrowDataCollRatio3Data,
};

const background4Data = {
    className: "background-3",
};

const buttonConnectWalletData = {
    children: "Connect Wallet",
};

const header4Data = {
    className: "header-3",
};

const landingPageData = {
    backgroundProps: background4Data,
    buttonConnectWalletProps: buttonConnectWalletData,
    headerProps: header4Data,
};

const header5Data = {
    className: "header-4",
};

const assetItem4Data = {
    className: "asset-item-1",
};

const tokenBorrow4Data = {
    className: "token-borrow-1",
};

const liquidate2Data = {
    assetItemProps: assetItem4Data,
    tokenBorrowProps: tokenBorrow4Data,
};

const assetItem5Data = {
    className: "asset-item-1",
};

const tokenBorrow5Data = {
    className: "token-borrow-1",
};

const liquidate22Data = {
    assetItemProps: assetItem5Data,
    tokenBorrowProps: tokenBorrow5Data,
};

const assetItem6Data = {
    className: "asset-item-1",
};

const tokenBorrow6Data = {
    className: "token-borrow-1",
};

const liquidate23Data = {
    assetItemProps: assetItem6Data,
    tokenBorrowProps: tokenBorrow6Data,
};

const liquidateData = {
    headerProps: header5Data,
    liquidate2Props: liquidate2Data,
    liquidate22Props: liquidate22Data,
    liquidate23Props: liquidate23Data,
};

const header6Data = {
    className: "header-5",
};

const tokenBorrow7Data = {
    className: "token-borrow-2",
};

const assetItem7Data = {
    className: "asset-item-2",
};

const previousBorrowData = {
    number: "50",
    text26: "50.02",
    percent: "30%",
    rectangle19: "/img/rectangle-19@2x.png",
    place: "WETH",
    x0X123456: "0x123456",
    repaid: "Repaid",
    spanText: <>175%<br /></>,
    spanText2: "Min. 150%",
    spanText3: <>12-OCT-2021<br /></>,
    spanText4: "0d 0h 0m",
    tokenBorrowProps: tokenBorrow7Data,
    assetItemProps: assetItem7Data,
};

const borrowDataCollRatio4Data = {
    maturity: "Maturity:",
    d: "2-DEC-2021",
    className: "borrow-data-coll-ratio-1",
};

const borrowDataCollRatio23Data = {
    collateralRatio: "Collateral Ratio",
    percent: "200%",
    className: "borrow-data-coll-ratio-4",
};

const borrowDataCollRatio24Data = {
    collateralRatio: "APR:",
    percent: "20%",
    className: "borrow-data-coll-ratio-5",
};

const borrowDataCollRatio5Data = {
    maturity: "Repayment:",
    d: "65.6726 WETH",
    className: "borrow-data-floor-price-1",
};

const borrowDataCollRatio6Data = {
    maturity: "Borrowed:",
    d: "65.4210",
    className: "borrow-data-collateral-1",
};

const asset2Data = {
    borrowDataCollRatioProps: borrowDataCollRatio4Data,
    borrowDataCollRatio2Props: borrowDataCollRatio23Data,
    borrowDataCollRatio22Props: borrowDataCollRatio24Data,
    borrowDataCollRatio2Props2: borrowDataCollRatio5Data,
    borrowDataCollRatio3Props: borrowDataCollRatio6Data,
};

const assetData = {
    prevBorrows: "Prev. Borrows",
    borrowed: "Borrowed",
    repayment: "Repayment",
    apr: "APR",
    collateral: "Collateral",
    collRatio: "Coll. Ratio",
    maturity: "Maturity",
    borrower: "Borrower",
    status: "Status",
    headerProps: header6Data,
    previousBorrowProps: previousBorrowData,
    asset2Props: asset2Data,
};

