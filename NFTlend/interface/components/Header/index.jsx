import React from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core"
import { injected } from "../../connectors"
import 'regenerator-runtime/runtime'
import "./Header.css";

function Header(props) {
  const { className } = props;
  const { active, account, activate, deactivate } = useWeb3React()

  console.log(active, account)

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
    <div className={`header ${className || ""}`}>
      <Link to="/landing-page">
        <div className="logo">
          <img className="nf-tlend-logo-light-1" src="/img/nftlend-logo-light-1@2x.png" />
          <div className="nf-tlendxyz valign-text-middle oxanium-semi-bold-web-orange-36px">NFTlend.xyz</div>
        </div>
      </Link>
      <div className="navigation">
        <Link to="/dashboard">
          <div className="nav-title dashboard-1 valign-text-middle oxanium-normal-white-22px">DASHBOARD</div>
        </Link>
        <Link to="/borrow">
          <div className="nav-title borrow valign-text-middle oxanium-normal-white-22px">BORROW</div>
        </Link>
        <Link to="/lend">
          <div className="nav-title place valign-text-middle oxanium-normal-white-22px">LEND</div>
        </Link>
        <Link to="/liquidate">
          <div className="nav-title liquidate valign-text-middle oxanium-normal-white-22px">LIQUIDATE</div>
        </Link>
        { active ? 
        <button onClick={disconnect} className="overlap-group-1">
          <div className="connect-wallet valign-text-middle oxanium-bold-white-22px">
            {account.substring(0,6)}...{account.slice(-4)}
          </div>
        </button>:
        <button onClick={connect} className="overlap-group-1">
          <div className="connect-wallet valign-text-middle oxanium-bold-white-22px">Connect Wallet</div>
        </button>
        }
      </div>
    </div>
  );
}

export default Header;
