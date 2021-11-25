import React from "react";
import "./TokenBorrow.css";

function TokenBorrow(props) {
  const { className } = props;

  return (
    <div className={`token-borrow-3 ${className || ""}`}>
      <img className="rectangle-19-1" src="/img/rectangle-19@2x.png" />
      <div className="place-6 valign-text-middle oxanium-normal-black-24px">WETH</div>
    </div>
  );
}

export default TokenBorrow;
