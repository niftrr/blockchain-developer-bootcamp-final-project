import React from "react";
import "./TokenBorrow.css";

function TokenBorrow(props) {
  const { className, token } = props;

  const tokenImage = {
    "DAI": "/img/dai-logo.png",
    "USDC": "/img/usdc-logo.png",
    "WETH": "/img/weth-logo.png"
  }

  return (
    <div className={`token-borrow-3 ${className || ""}`}>
      <img className="rectangle-19-1" src={tokenImage[token]} />
      <div className="place-6 valign-text-middle oxanium-normal-black-24px">{token}</div>
    </div>
  );
}

export default TokenBorrow;
