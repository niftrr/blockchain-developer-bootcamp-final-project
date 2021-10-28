import React from "react";
import { useWeb3React } from "@web3-react/core"
import { injected } from "../wallet/connectors"
import "./ButtonConnectWallet.css";

function ButtonConnectWallet(props) {
  const { children } = props;
  const { active, account, library, connector, activate, deactivate } = useWeb3React()

  async function connect() {
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  async function disconnect() {
    try {
      await deactivate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <div>
      { active ?
        <button onClick={disconnect} className="button-connect-wallet">
          <div className="connect-wallet-6 valign-text-middle">Connected</div>
        </button>:
        <button onClick={connect} className="button-connect-wallet">
          <div className="connect-wallet-6 valign-text-middle">{children}</div>
        </button>}
    </div>
  );
}

export default ButtonConnectWallet;
