import React, { useEffect } from "react";
import "./PopUpNFT.css";
import { useAppContext } from "../../AppContext";
import useLendingPool from "../../hooks/useLendingPool";
import TransactionStatus from "../TransactionStatus";
import useTransaction from "../../hooks/useTransaction";
import { useWeb3React } from "@web3-react/core";

function PopUpNFT(props) {
  const { value, tokenAddress, borrowId, spanText, spanText2, nftAvatar, rectangle19, inputType, inputPlaceholder, nftSymbol, nftTokenId, token } = props;
  const { account } = useWeb3React();
  const { repay } = useLendingPool();
  const { txnStatus } = useTransaction();

  const handleRepaySubmit = () => {
    repay(tokenAddress, value, borrowId);
  }

  useEffect(() => {
    if (account) {
      txnStatus
    }    
  }, [account]);

  const tokenImage = {
    "DAI": "/img/dai-logo.png",
    "USDC": "/img/usdc-logo.png",
    "WETH": "/img/weth-logo.png"
  }

  return (
    <div className="pop-up-nft">
      <div className="pop-up-text valign-text-middle oxanium-bold-web-orange-32px">
        <span>
          <span className="oxanium-bold-web-orange-32px">{spanText}<br></br><br></br></span>
          <span className="oxanium-extra-light-web-orange-24px">{spanText2}</span>
        </span>
      </div>
      <img className="nft-avatar" src={nftAvatar} />
      <div>
        <span>
          <span className="liquidation-nft oxanium-extra-light-web-orange-24px">{nftSymbol} #{nftTokenId}</span>
        </span>
      </div>
      <br/>
      <TransactionStatus />
      <div className="overlap-group1 border-1px-black">
        <img className="rectangle-19" src={tokenImage[token]} />
        <input
          align="right"
          className="x19111-repay oxanium-normal-black-24px"
          name="19111"
          value={value}
          type={inputType}
          readOnly
        />
      </div>
      <div onClick={handleRepaySubmit} className="overlap-group">
        <button onClick={handleRepaySubmit} className="rectangle-47"></button>
        <div className="repay valign-text-middle oxanium-normal-white-24px">Repay</div>
      </div>
    </div>
  );
}

export default PopUpNFT;