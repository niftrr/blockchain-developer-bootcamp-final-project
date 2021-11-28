import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core"
import { injected } from "../../connectors"
import { useAppContext } from "../../AppContext";
import useAssetToken from "../../hooks/useAssetToken";
import useTransaction from "../../hooks/useTransaction";
import 'regenerator-runtime/runtime'
import "./Header.css";

function Header(props) {
  const { className } = props;
  const { active, account, activate, deactivate } = useWeb3React()
  const {fetchAssetTokenBalances} = useAssetToken();
  const { assetTokenBalanceDAI,assetTokenBalanceUSDC,assetTokenBalanceWETH } = useAppContext();
  const { txnStatus } = useTransaction();

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

  const formatPrice = (price, decimals) => {
    return parseFloat(price).toFixed(Math.min(decimals, (price.toString().split('.')[1] || []).length))
  }

  useEffect(() => {
    if (account) {
      fetchAssetTokenBalances();
    }    
  }, [account, txnStatus, assetTokenBalanceDAI, assetTokenBalanceUSDC, assetTokenBalanceWETH]);

  return (
    <div className={`header ${className || ""}`}>
      <Link to="/">
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
        <button onClick={disconnect} className="overlap-group-3-balance border-2px-white oxanium-normal-white-18px">
          {/* <div className="connect-wallet valign-text-middle oxanium-bold-white-22px">
            {account.substring(0,6)}...{account.slice(-4)}
          </div> */}
          {/* <div className="overlap-group-3-balance border-2px-white oxanium-normal-white-18px"> */}
            <div className="overlap-group1-1-balance">
              <div className="balance-item">
                <img className="dai-logo" src="/img/dai-logo.png" />
                <div className="balance valign-text-middle oxanium-extra-light-web-white-18px">{formatPrice(assetTokenBalanceDAI,1)}</div>
              </div>
              <div className="balance-item">
                <img className="usdc-logo" src="/img/usdc-logo.png" />
                <div className="balance valign-text-middle oxanium-extra-light-web-white-18px">{formatPrice(assetTokenBalanceUSDC,1)}</div>
              </div>
              <div className="balance-item">
                <img className="weth-logo" src="/img/weth-logo.png" />
                <div className="balance valign-text-middle oxanium-extra-light-web-white-18px">{formatPrice(assetTokenBalanceWETH,4)}</div>
              </div>
            </div>
          
          {/* </div> */}
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
