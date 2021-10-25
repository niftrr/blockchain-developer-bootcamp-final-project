import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header(props) {
  const { className } = props;

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
          <div className="dashboard valign-text-middle oxanium-normal-white-22px">DASHBOARD</div>
        </Link>
        <Link to="/borrow">
          <div className="borrow valign-text-middle oxanium-normal-white-22px">BORROW</div>
        </Link>
        <Link to="/lend">
          <div className="place valign-text-middle oxanium-normal-white-22px">LEND</div>
        </Link>
        <Link to="/liquidate">
          <div className="liquidate valign-text-middle oxanium-normal-white-22px">LIQUIDATE</div>
        </Link>
        <div className="overlap-group">
          <div className="connect-wallet valign-text-middle oxanium-bold-white-22px">Connect Wallet</div>
        </div>
      </div>
    </div>
  );
}

export default Header;
