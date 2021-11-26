import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import AssetItem from "../AssetItem";
import TokenBorrow from "../TokenBorrow";
import ButtonLiquidate from "../ButtonLiquidate";
import "./Liquidate2.css";
import useNFT from "../../hooks/useNFT";

function Liquidate2(props) {
  const { assetItemProps, tokenBorrowProps, liquidationPrice, maturityTimestamp, collRatio, token, tokenAddress, nftSymbol, nftTokenId, borrowId } = props;
  const { account } = useWeb3React();
  const { 
    fetchImageBAYC,
    fetchImagePUNK} = useNFT();

  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    if (account) {
      async function fetchImgUrl() {
        if (nftSymbol=="BAYC"){
          let _imgUrl = await fetchImageBAYC(nftTokenId);
          setImgUrl(_imgUrl)
        } else {
          let _imgUrl = await fetchImagePUNK(nftTokenId);
          setImgUrl(_imgUrl)
        } 
      }
      fetchImgUrl();
    }  
  }, [account]);



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
    if (collRatio < 150){
      ret = `oxanium-${weight}-red-20px`;
    } 
    return ret;
  }

  const warningClassMaturity = (weight) => {
    let ret = `oxanium-${weight}-black-20px`;
    let maturity = new Date(maturityTimestamp * 1000);
    let now = new Date().getTime(); 
    if (now > maturity){
      ret = `oxanium-${weight}-red-20px`;
    } 
    return ret;
  }

  const formatPrice = (price, decimals) => {
    return price.toFixed(Math.max(decimals, (price.toString().split('.')[1] || []).length))
  }

  return (
    <div className="liquidate-7">
      <div className="overlap-group-18">
        <div className="rectangle-20"></div>
        <ButtonLiquidate 
          borrowId={borrowId}
          liquidationPrice={liquidationPrice}
          nftSymbol={nftSymbol}
          nftTokenId={nftTokenId}
          tokenAddress={tokenAddress}
          token={token}
          imgUrl={imgUrl}
        />
        <div className="text-3 valign-text-middle oxanium-bold-black-20px">
          <span>
            <span className={warningClassMaturity("bold")}>
              {formatDate(maturityTimestamp)}
              <br />
            </span>
            <span className={warningClassMaturity("normal")}>{formatCountdown(maturityTimestamp)}</span>
          </span>
        </div>
        <div className="x130-min-150 valign-text-middle oxanium-bold-red-20px">
          <span>
            <span className={warningClassCollRatio("bold")}>
              {collRatio}%
              <br />
            </span>
            <span className={warningClassCollRatio("normal")}>Min. 150%</span>
          </span>
        </div>
        <AssetItem 
          className={assetItemProps.className} 
          imgUrl={imgUrl}
          nftSymbol={nftSymbol} 
          nftTokenId={nftTokenId} 
        />
        <div className="text-2-1 valign-text-middle oxanium-normal-black-24px">{formatPrice(liquidationPrice,4)}</div>
        <TokenBorrow 
          className={tokenBorrowProps.className}
          token={token} 
        />
      </div>
    </div>
  );
}

export default Liquidate2;
