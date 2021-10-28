import React from "react";
import Header from "../Header";
import Background from "../Background";
import LiquidateHeader from "../LiquidateHeader";
import Liquidate2 from "../Liquidate2";
import Instructions from "../Instructions";
import "./Liquidate.css";

function Liquidate(props) {
  const { headerProps, liquidate2Props, liquidate22Props, liquidate23Props } = props;

  return (
    <div className="container-center-horizontal">
      <div className="liquidate-6 screen">
        <Header className={headerProps.className} />
        <div className="overlap-group4-1">
          <Background />
          <div className="liquidate-container">
            <LiquidateHeader />
            <Liquidate2
              assetItemProps={liquidate2Props.assetItemProps}
              tokenBorrowProps={liquidate2Props.tokenBorrowProps}
            />
            <Liquidate2
              assetItemProps={liquidate22Props.assetItemProps}
              tokenBorrowProps={liquidate22Props.tokenBorrowProps}
            />
            <Liquidate2
              assetItemProps={liquidate23Props.assetItemProps}
              tokenBorrowProps={liquidate23Props.tokenBorrowProps}
            />
          </div>
          <Instructions />
        </div>
      </div>
    </div>
  );
}

export default Liquidate;
