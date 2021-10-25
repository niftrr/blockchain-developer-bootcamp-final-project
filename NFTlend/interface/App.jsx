import "./App.css";
import React from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import Asset from "./components/Asset";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import Borrow2 from "./components/Borrow2";
import Lend2 from "./components/Lend2";
import Liquidate from "./components/Liquidate";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/asset">
          <Asset {...assetData} />
        </Route>
        <Route path="/dashboard">
          <Dashboard
            headerProps={dashboardData.headerProps}
            borrowProps={dashboardData.borrowProps}
            borrow2Props={dashboardData.borrow2Props}
            borrow3Props={dashboardData.borrow3Props}
            lendsProps={dashboardData.lendsProps}
          />
        </Route>
        <Route path="/:path(|landing-page)">
          <LandingPage
            text13="The NFT Liquidity Protocol"
            text14="NFTlend.xyz is an open-source, non-custodial liquidity protocol for borrowing assets using NFTs as collateral and earning interest on deposits."
            backgroundProps={landingPageData.backgroundProps}
            buttonConnectWalletProps={landingPageData.buttonConnectWalletProps}
            headerProps={landingPageData.headerProps}
          />
        </Route>
        <Route path="/borrow">
          <Borrow2 {...borrow22Data} />
        </Route>
        <Route path="/lend">
          <Lend2 lendsProps={lend22Data.lendsProps} />
        </Route>
        <Route path="/liquidate">
          <Liquidate
            liquidate2Props={liquidateData.liquidate2Props}
            liquidate22Props={liquidateData.liquidate22Props}
            liquidate23Props={liquidateData.liquidate23Props}
          />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
const previousBorrowData = {
    number: "50",
    text1: "50.02",
    percent: "30%",
    rectangle19: "/img/rectangle-19@2x.png",
    place: "ETH",
    x0X123456: "0x123456",
    repaid: "Repaid",
    spanText: <>175%<br /></>,
    spanText2: "Min. 150%",
    spanText3: <>12-OCT-2021<br /></>,
    spanText4: "0d 0h 0m",
};

const borrowDataCollRatioData = {
    maturity: "Maturity:",
    d: "2-DEC-2021",
};

const borrowDataCollRatio2Data = {
    collateralRatio: "Collateral Ratio",
    percent: "200%",
};

const borrowDataCollRatio22Data = {
    collateralRatio: "APR:",
    percent: "20%",
    className: "borrow-data-coll-ratio-3",
};

const borrowDataCollRatio3Data = {
    maturity: "Repayment:",
    d: "65.6726 ETH",
    className: "borrow-data-floor-price",
};

const borrowDataCollRatio4Data = {
    maturity: "Borrowed:",
    d: "65.4210",
    className: "borrow-data-collateral",
};

const asset2Data = {
    borrowDataCollRatioProps: borrowDataCollRatioData,
    borrowDataCollRatio2Props: borrowDataCollRatio2Data,
    borrowDataCollRatio22Props: borrowDataCollRatio22Data,
    borrowDataCollRatio2Props2: borrowDataCollRatio3Data,
    borrowDataCollRatio3Props: borrowDataCollRatio4Data,
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
    previousBorrowProps: previousBorrowData,
    asset2Props: asset2Data,
};

const header2Data = {
    className: "header-1",
};

const buttonBorrowData = {
    children: "Borrow",
};

const buttonRepayData = {
    children: "Repay",
};

const tokenBorrow2Data = {
    className: "token-borrow-1",
};

const borrowData = {
    buttonBorrowProps: buttonBorrowData,
    buttonRepayProps: buttonRepayData,
    tokenBorrowProps: tokenBorrow2Data,
};

const buttonBorrow2Data = {
    children: "Borrow",
};

const buttonRepay2Data = {
    children: "Repay",
};

const tokenBorrow3Data = {
    className: "token-borrow-1",
};

const borrow2Data = {
    buttonBorrowProps: buttonBorrow2Data,
    buttonRepayProps: buttonRepay2Data,
    tokenBorrowProps: tokenBorrow3Data,
};

const buttonBorrow3Data = {
    children: "Borrow",
};

const buttonRepay3Data = {
    children: "Repay",
};

const tokenBorrow4Data = {
    className: "token-borrow-1",
};

const borrow3Data = {
    buttonBorrowProps: buttonBorrow3Data,
    buttonRepayProps: buttonRepay3Data,
    tokenBorrowProps: tokenBorrow4Data,
};

const buttonBorrow4Data = {
    children: "Deposit",
    className: "button-deposit-2",
};

const buttonRepay4Data = {
    children: "Withdraw",
    className: "button-withdraw-2",
};

const lendData = {
    buttonBorrowProps: buttonBorrow4Data,
    buttonRepayProps: buttonRepay4Data,
};

const buttonBorrow5Data = {
    children: "Deposit",
    className: "button-deposit-3",
};

const buttonRepay5Data = {
    children: "Withdraw",
    className: "button-withdraw-3",
};

const lend2Data = {
    buttonBorrowProps: buttonBorrow5Data,
    buttonRepayProps: buttonRepay5Data,
};

const buttonBorrow6Data = {
    children: "Deposit",
    className: "button-deposit",
};

const buttonRepay6Data = {
    children: "Withdraw",
    className: "button-withdraw",
};

const lend3Data = {
    buttonBorrowProps: buttonBorrow6Data,
    buttonRepayProps: buttonRepay6Data,
};

const lendsData = {
    lendProps: lendData,
    lend2Props: lend2Data,
    lend3Props: lend3Data,
};

const dashboardData = {
    headerProps: header2Data,
    borrowProps: borrowData,
    borrow2Props: borrow2Data,
    borrow3Props: borrow3Data,
    lendsProps: lendsData,
};

const background3Data = {
    className: "background-2",
};

const buttonConnectWalletData = {
    children: "Connect Wallet",
};

const header3Data = {
    className: "header-2",
};

const landingPageData = {
    backgroundProps: background3Data,
    buttonConnectWalletProps: buttonConnectWalletData,
    headerProps: header3Data,
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
    className: "button-borrow-1",
};

const borrowDataCollRatio5Data = {
    maturity: "Repayment Amount:",
    d: "65.6726",
    className: "borrow-data-coll-ratio-1",
};

const borrowDataCollRatio23Data = {
    collateralRatio: "APR",
    percent: "20%",
    className: "borrow-data-coll-ratio-4",
};

const borrowDataCollRatio24Data = {
    collateralRatio: "Collateralization Ratio:",
    percent: "200%",
    className: "borrow-data-coll-ratio-5",
};

const borrowDataCollRatio6Data = {
    maturity: "Collateral:",
    d: "Fidenza #157",
    className: "borrow-data-collateral-1",
};

const borrow22Data = {
    nftAvatar: "/img/nft-avatar-1@2x.png",
    amount: "Amount:",
    text16: "Current Floor Price:",
    address: "120 ETH",
    itemProjectProps: itemProject2Data,
    itemProject2Props: itemProject3Data,
    itemNFTProps: itemNFTData,
    borrowTokenProps: borrowTokenData,
    inputTextProps: inputTextData,
    borrowToken2Props: borrowToken2Data,
    buttonBorrowProps: buttonBorrow7Data,
    borrowDataCollRatioProps: borrowDataCollRatio5Data,
    borrowDataCollRatio2Props: borrowDataCollRatio23Data,
    borrowDataCollRatio22Props: borrowDataCollRatio24Data,
    borrowDataCollRatio2Props2: borrowDataCollRatio6Data,
};

const buttonBorrow8Data = {
    children: "Deposit",
    className: "button-deposit-1-1",
};

const buttonRepay7Data = {
    children: "Withdraw",
    className: "button-withdraw-1-1",
};

const lend4Data = {
    buttonBorrowProps: buttonBorrow8Data,
    buttonRepayProps: buttonRepay7Data,
};

const buttonBorrow9Data = {
    children: "Deposit",
    className: "button-deposit-1-2",
};

const buttonRepay8Data = {
    children: "Withdraw",
    className: "button-withdraw-1-2",
};

const lend5Data = {
    buttonBorrowProps: buttonBorrow9Data,
    buttonRepayProps: buttonRepay8Data,
};

const buttonBorrow10Data = {
    children: "Deposit",
    className: "button-deposit-1",
};

const buttonRepay9Data = {
    children: "Withdraw",
    className: "button-withdraw-1",
};

const lend6Data = {
    buttonBorrowProps: buttonBorrow10Data,
    buttonRepayProps: buttonRepay9Data,
};

const lends2Data = {
    className: "lends-1",
    lendProps: lend4Data,
    lend2Props: lend5Data,
    lend3Props: lend6Data,
};

const lend22Data = {
    lendsProps: lends2Data,
};

const assetItem5Data = {
    className: "asset-item-1",
};

const liquidate2Data = {
    assetItemProps: assetItem5Data,
};

const assetItem6Data = {
    className: "asset-item-1",
};

const liquidate22Data = {
    assetItemProps: assetItem6Data,
};

const assetItem7Data = {
    className: "asset-item-1",
};

const liquidate23Data = {
    assetItemProps: assetItem7Data,
};

const liquidateData = {
    liquidate2Props: liquidate2Data,
    liquidate22Props: liquidate22Data,
    liquidate23Props: liquidate23Data,
};

