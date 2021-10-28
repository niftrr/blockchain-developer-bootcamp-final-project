import React from "react";
import PopUpNFT from "../PopUpNFT";
import "./PopUpNFTs.css";

function PopUpNFTs(props) {
  const { popUpNFTProps } = props;

  return (
    <div className="container-center-horizontal">
      <div className="popupnfts screen">
        <PopUpNFT
          spanText="Repay borrow."
          spanText2="Repay borrow to retreive your NFT."
          nftAvatar="/img/nft-avatar@2x.png"
          rectangle19="/img/rectangle-19@2x.png"
          inputType="text"
          inputPlaceholder="0.0000"
          repay="Repay"
        />
      </div>
    </div>
  );
}

export default PopUpNFTs;
