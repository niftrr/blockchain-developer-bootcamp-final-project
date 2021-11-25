import React from "react";
import "./TokenLend.css";

function TokenLend(props) {
  const { token } = props;

  const tokenImage = {
    "DAI": "/img/dai-logo.png",
    "USDC": "/img/usdc-logo.png",
    "WETH": "/img/weth-logo.png",
  }

  return (
    <div className="token-lend">
      <img className="rectangle-25" src={tokenImage[token]} />
      <div className="dai valign-text-middle oxanium-normal-black-24px">{token}</div>
    </div>
  );
}

export default TokenLend;
