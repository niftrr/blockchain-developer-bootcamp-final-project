import React, { useEffect, useState } from "react";
import "./PopUpLiquidate2.css";
import { useAppContext } from "../../AppContext";
import useLendingPool from "../../hooks/useLendingPool";
import TransactionStatus from "../TransactionStatus";
import useTransaction from "../../hooks/useTransaction";
import { useWeb3React } from "@web3-react/core";
import useNFT from "../../hooks/useNFT";

function PopUpLiquidate2(props) {
  const { value, tokenAddress, borrowId, spanText, spanText2, rectangle19, inputType, buttonText, inputPlaceholder, nftSymbol, nftTokenId, imgUrl, token } = props;
  const { account } = useWeb3React();
  const { liquidate } = useLendingPool();
  const { txnStatus } = useTransaction();
  const { fetchImageBAYC, fetchImagePUNK } = useNFT();

  const handleRepaySubmit = () => {
    liquidate(tokenAddress, value, borrowId);
  }

  const formatPrice = (price, decimals) => {
    return price.toFixed(Math.max(decimals, (price.toString().split('.')[1] || []).length))
  }

  return (
    <div className="pop-up-nft">
      <div className="pop-up-text valign-text-middle oxanium-bold-web-orange-32px">
        <span>
          <span className="oxanium-bold-web-orange-32px">{spanText}<br></br><br></br></span>
          <span className="oxanium-extra-light-web-orange-24px">{spanText2}</span>
        </span>
      </div>
      <TransactionStatus />
      <img className="nft-avatar" src={imgUrl} />
      <div>
        <span>
          <span className="liquidation-nft oxanium-extra-light-web-orange-24px">{nftSymbol} #{nftTokenId}</span>
        </span>
      </div>
      <div className="overlap-group1 border-1px-black">
        <img className="rectangle-19" src={rectangle19} />
        
        <input
          align="right"
          className="x19111-repay oxanium-normal-black-24px"
          name="19111"
          value={formatPrice(value,4)}
          type={inputType}
          readOnly
        />
      </div>
      <div onClick={handleRepaySubmit} className="overlap-group">
        <button onClick={handleRepaySubmit} className="rectangle-47"></button>
        <div className="repay valign-text-middle oxanium-normal-white-24px">{buttonText}</div>
      </div>
    </div>
  );
}

export default PopUpLiquidate2;