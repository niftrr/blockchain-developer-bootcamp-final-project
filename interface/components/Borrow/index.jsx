import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import AssetItem from "../AssetItem";
import ButtonRepay from "../ButtonRepay";
import TokenBorrow from "../TokenBorrow";
import "./Borrow.css";
import useCollateralManager from "../../hooks/useCollateralManager";
import { useAppContext } from "../../AppContext";
import useNFT from "../../hooks/useNFT";
import useLendingPool from "../../hooks/useLendingPool";


function Borrow(props) {
  const {borrowId} = props;
  const { account } = useWeb3React();
  const { fetchUserBorrows } = useCollateralManager();
  const { assetTokenContractAddressSymbolLookup } = useLendingPool();
  const { userBorrows } = useAppContext();
  const { 
    fetchImageBAYC,
    fetchImagePUNK} = useNFT();

  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    if (account) {
      fetchUserBorrows();
      userBorrows;
      async function fetchImgUrl() {
        const nftTokenId = await userBorrows[borrowId]["nftTokenId"];
        if (userBorrows[borrowId]["nftSymbol"]=="BAYC"){
          let _imgUrl = await fetchImageBAYC(nftTokenId);
          setImgUrl(_imgUrl)
        } else {
          let _imgUrl = await fetchImagePUNK(nftTokenId);
          setImgUrl(_imgUrl)
        } 
      }
      fetchImgUrl();
    }  
  }, [account, userBorrows]);

  const formatDate = (timestamp) => {
    let monthNames =["Jan","Feb","Mar","Apr",
                      "May","Jun","Jul","Aug",
                      "Sep", "Oct","Nov","Dec"];
    
    let date = new Date(timestamp * 1000);
    let day = date.getDate();
    
    let monthIndex = date.getMonth();
    let monthName = monthNames[monthIndex];
    
    let year = date.getFullYear();
    return `${day}-${monthName}-${year}`;  
  }

  const formatCountdown = (timestamp) => {
    let countDownDate = new Date(timestamp * 1000);

    let now = new Date().getTime(); 
    let distance = countDownDate - now;
      
    let days = distance / (1000 * 60 * 60 * 24);
    let hours = (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
    let minutes = (distance % (1000 * 60 * 60)) / (1000 * 60);
    if (distance > 0) {
      days = Math.floor(days);
      hours = Math.floor(hours);
      minutes = Math.floor(minutes);
    } else {
      days = Math.ceil(days);
      hours = Math.ceil(hours);
      minutes = Math.ceil(minutes);
    }

    return `${days}d ${hours}h ${minutes}m`;
  }

  const warningClassCollRatio = (weight) => {
    let ret = `oxanium-${weight}-black-20px`;
    if (userBorrows[borrowId]["collRatio"] < 150){
      ret = `oxanium-${weight}-red-20px`;
    } 
    return ret;
  }

  const warningClassMaturity = (weight) => {
    let ret = `oxanium-${weight}-black-20px`;
    let maturity = new Date(userBorrows[borrowId]["maturity"] * 1000);
    let now = new Date().getTime(); 
    if (now > maturity){
      ret = `oxanium-${weight}-red-20px`;
    } 
    return ret;
  }

  return (
    <div className="borrow-6">
      <div className="overlap-group-13">
        <div className="rectangle-17"></div>
        <div className="number valign-text-middle oxanium-normal-black-24px">{Number(userBorrows[borrowId]["borrowAmount"]).toFixed(1)}</div> {/* TODO: Make number of decimals consistent  */}
        <div className="text valign-text-middle oxanium-normal-black-25px">{Number(userBorrows[borrowId]["repaymentAmount"]).toFixed(4)}</div>
        <div className="percent valign-text-middle oxanium-normal-black-25px">{Number(userBorrows[borrowId]["interestRate"]).toFixed(0)}</div>
        <AssetItem 
          nftSymbol={userBorrows[borrowId]["nftSymbol"]}
          nftTokenId={userBorrows[borrowId]["nftTokenId"]}
          imgUrl={imgUrl}
        />
        <ButtonRepay 
          borrowId={borrowId}
          repaymentAmount={userBorrows[borrowId]["repaymentAmount"]}
          nftSymbol={userBorrows[borrowId]["nftSymbol"]}
          nftTokenId={userBorrows[borrowId]["nftTokenId"]}
          imgUrl={imgUrl}
          tokenAddress={userBorrows[borrowId]["erc20Token"]}
          token={assetTokenContractAddressSymbolLookup[userBorrows[borrowId]["erc20Token"]]} 
        />
        <div className="x175-min-150 valign-text-middle oxanium-bold-black-20px">
          <span>
            <span className={warningClassCollRatio("bold")}>
              175%
              <br />
            </span>
            <span className={warningClassCollRatio("normal")}>Min. 150%</span>
          </span>
        </div>
        <div className="text-1 valign-text-middle oxanium-bold-black-20px">
          <span>
            <span className={warningClassMaturity("bold")}>
            {formatDate(userBorrows[borrowId]["maturity"])}
              <br />
            </span>
            <span className={warningClassMaturity("normal")}>{formatCountdown(userBorrows[borrowId]["maturity"])}</span>
          </span>
        </div>
        <TokenBorrow token={assetTokenContractAddressSymbolLookup[userBorrows[borrowId]["erc20Token"]]} />
      </div>
    </div>
  );
}

export default Borrow;