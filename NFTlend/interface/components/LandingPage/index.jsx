import React from "react";
import Background from "../Background";
import ButtonConnectWallet from "../ButtonConnectWallet";
import Header from "../Header";
import "./LandingPage.css";

function LandingPage(props) {
  const { text17, text18, backgroundProps, buttonConnectWalletProps, headerProps } = props;

  return (
    <div className="container-center-horizontal">
      <div className="landing-page screen">
        <div className="overlap-group1-4">
          <Background className={backgroundProps.className} />
          <div className="body">
            <h1 className="text-17 valign-text-middle">{text17}</h1>
            <div className="text-18 valign-text-middle">{text18}</div>
            <div className="button-container">
              <ButtonConnectWallet>{buttonConnectWalletProps.children}</ButtonConnectWallet>
            </div>
          </div>
          <Header className={headerProps.className} />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
