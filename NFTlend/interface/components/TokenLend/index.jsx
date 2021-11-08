import React from "react";
import "./TokenLend.css";

function TokenLend(props) {
  const { token } = props;

  const tokenImage = {
    "DAI": "/img/rectangle-25@2x.png",
    "ETH": "/img/rectangle-27@2x.png",
    "USDC": "/img/rectangle-22@2x.png"
  }

  return (
    <div className="token-lend">
      <img className="rectangle-25" src={tokenImage[token]} />
      <div className="dai valign-text-middle oxanium-normal-black-24px">{token}</div>
    </div>
  );
}

export default TokenLend;
