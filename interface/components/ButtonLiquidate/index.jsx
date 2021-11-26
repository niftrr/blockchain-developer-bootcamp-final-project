import React from "react";
import { Link } from "react-router-dom";
import "./ButtonLiquidate.css";
import PopUpLiquidate from '../PopUpLiquidate';
import Popup from 'reactjs-popup';

function ButtonLiquidate(props) {
  const {
    borrowId, 
    liquidationPrice,
    tokenAddress,
    nftSymbol,
    nftTokenId, 
    imgUrl,
    token
  } = props;
  
  return (
    <Popup modal trigger={
      <button className="overlap-group-19">
        <div className="liquidate-8 valign-text-middle oxanium-normal-white-20px">Liquidate</div>
      </button>} modal nested>
      <PopUpLiquidate
        borrowId={borrowId}
        liquidationPrice={liquidationPrice}
        tokenAddress={tokenAddress}
        nftSymbol={nftSymbol}
        nftTokenId={nftTokenId}
        imgUrl={imgUrl}
        token={token}
      />
      </Popup>
  );
}

export default ButtonLiquidate;