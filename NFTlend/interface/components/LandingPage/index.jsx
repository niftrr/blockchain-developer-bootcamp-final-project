import React from "react";
import Background from "../Background";
import ButtonConnectWallet from "../ButtonConnectWallet";
import Header from "../Header";
import "./LandingPage.css";

function LandingPage(props) {
  const { text13, text14, backgroundProps, buttonConnectWalletProps, headerProps } = props;

  return (
    <div className="container-center-horizontal">
      <div className="landing-page screen">
        <div className="overlap-group1-2">
          <Background className={backgroundProps.className} />
          <div className="body">
            <h1 className="text-13 valign-text-middle">{text13}</h1>
            <div className="text-14 valign-text-middle">{text14}</div>
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
