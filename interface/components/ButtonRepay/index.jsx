import React from "react";
import { Link } from "react-router-dom";
import "./ButtonRepay.css";
import PopUpNFTs from '../PopUpNFTs';
import Popup from 'reactjs-popup';

function ButtonRepay(props) {
  const { 
    borrowId, 
    repaymentAmount,
    tokenAddress,
    nftSymbol,
    nftTokenId, 
    imgUrl} = props;

  return (
    <Popup modal trigger={
      <div className="button-repay">
        <button className="overlap-group-14">
            <div className="rectangle-11"></div>
          <div className="repay-1 valign-text-middle oxanium-normal-white-20px">Repay</div>
        </button>
      </div>} modal nested>
      <PopUpNFTs
        borrowId={borrowId}
        repaymentAmount={repaymentAmount}
        tokenAddress={tokenAddress}
        nftSymbol={nftSymbol}
        nftTokenId={nftTokenId}
        imgUrl={imgUrl}
      />
      </Popup>
  );
}

export default ButtonRepay;