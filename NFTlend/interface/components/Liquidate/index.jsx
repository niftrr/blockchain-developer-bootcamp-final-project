import React from "react";
import Header from "../Header";
import Background3 from "../Background3";
import LiquidateHeader from "../LiquidateHeader";
import Liquidate2 from "../Liquidate2";
import Instructions from "../Instructions";
import "./Liquidate.css";

function Liquidate(props) {
  const { liquidate2Props, liquidate22Props, liquidate23Props } = props;

  return (
    <div className="container-center-horizontal">
      <div className="liquidate-6 screen">
        <Header />
        <div className="overlap-group4">
          <Background3 />
          <div className="liquidate-container">
            <LiquidateHeader />
            <Liquidate2 assetItemProps={liquidate2Props.assetItemProps} />
            <Liquidate2 assetItemProps={liquidate22Props.assetItemProps} />
            <Liquidate2 assetItemProps={liquidate23Props.assetItemProps} />
          </div>
          <Instructions />
        </div>
      </div>
    </div>
  );
}

export default Liquidate;
