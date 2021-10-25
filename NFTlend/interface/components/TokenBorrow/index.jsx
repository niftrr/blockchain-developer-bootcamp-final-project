import React from "react";
import "./TokenBorrow.css";

function TokenBorrow(props) {
  const { className } = props;

  return (
    <div className={`token-borrow-2 ${className || ""}`}>
      <img className="rectangle-19-3" src="/img/rectangle-19@2x.png" />
      <div className="place-9 valign-text-middle oxanium-normal-black-24px">ETH</div>
    </div>
  );
}

export default TokenBorrow;
