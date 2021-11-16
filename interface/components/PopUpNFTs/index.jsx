import React from "react";
import PopUpNFT from "../PopUpNFT";
import "./PopUpNFTs.css";

function PopUpNFTs(props) {
  const { 
    popUpNFTProps,
    borrowId, 
    repaymentAmount,
    tokenAddress,
    nftSymbol,
    nftTokenId, 
    imgUrl } = props;

  return (
    <div className="container-center-horizontal">
      <div className="popupnfts screen">
        <PopUpNFT
          spanText="Repay borrow."
          spanText2="Repay borrow to retreive your NFT."
          nftAvatar={imgUrl}
          rectangle19="/img/rectangle-19@2x.png"
          inputType="text"
          value={repaymentAmount}
          tokenAddress={tokenAddress}
          borrowId={borrowId}
          repay="Repay"
        />
      </div>
    </div>
  );
}

export default PopUpNFTs;