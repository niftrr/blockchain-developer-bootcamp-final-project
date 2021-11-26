import React from "react";
import PopUpLiquidate2 from "../PopUpLiquidate2";
import "./PopUpLiquidate.css";

function PopUpLiquidate(props) {
  const { 
    popUpNFTProps,
    borrowId, 
    liquidationPrice,
    tokenAddress,
    nftSymbol,
    nftTokenId, 
    token,
    imgUrl } = props;

  const tokenImage = {
    "DAI": "/img/dai-logo.png",
    "USDC": "/img/usdc-logo.png",
    "WETH": "/img/weth-logo.png"
  }

  console.log('popUpLiquidate liquidationPrice', liquidationPrice);

  return (
    <div className="container-center-horizontal">
      <div className="popupnfts screen">
        <PopUpLiquidate2
          spanText="Liquidate borrow."
          spanText2="Liquidate borrow to retrieve the underlying NFT."
          imgUrl={imgUrl}
          rectangle19={tokenImage[token]}
          inputType="text"
          value={liquidationPrice}
          tokenAddress={tokenAddress}
          borrowId={borrowId}
          buttonText="Liquidate"
          nftSymbol={nftSymbol}
          nftTokenId={nftTokenId}
        />
      </div>
    </div>
  );
}

export default PopUpLiquidate;