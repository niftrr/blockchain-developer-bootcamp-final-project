import React from "react";
import AssetItem from "../AssetItem";
import TokenBorrow from "../TokenBorrow";
import "./Liquidate2.css";

function Liquidate2(props) {
  const { assetItemProps } = props;

  return (
    <div className="liquidate-7">
      <div className="overlap-group-16">
        <div className="rectangle-20"></div>
        <div className="overlap-group-17">
          <div className="liquidate-8 valign-text-middle oxanium-normal-white-20px">Liquidate</div>
        </div>
        <div className="text-2-1 valign-text-middle oxanium-bold-black-20px">
          <span>
            <span className="oxanium-bold-black-20px">
              19-DEC-2022
              <br />
            </span>
            <span className="oxanium-normal-black-20px">0d 2h 22m</span>
          </span>
        </div>
        <div className="x130-min-150 valign-text-middle oxanium-bold-red-20px">
          <span>
            <span className="oxanium-bold-red-20px">
              130%
              <br />
            </span>
            <span className="oxanium-normal-red-20px">Min. 150%</span>
          </span>
        </div>
        <AssetItem className={assetItemProps.className} />
        <div className="text-2-2 valign-text-middle oxanium-normal-black-24px">210,342.3414</div>
        <TokenBorrow />
      </div>
    </div>
  );
}

export default Liquidate2;
