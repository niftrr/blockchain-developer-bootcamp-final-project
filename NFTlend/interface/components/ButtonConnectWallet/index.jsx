import React from "react";
import "./ButtonConnectWallet.css";

function ButtonConnectWallet(props) {
  const { children } = props;

  return (
    <div className="button-connect-wallet">
      <div className="connect-wallet-6 valign-text-middle">{children}</div>
    </div>
  );
}

export default ButtonConnectWallet;
