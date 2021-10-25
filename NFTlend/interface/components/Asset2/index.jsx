import React from "react";
import BorrowDataCollRatio from "../BorrowDataCollRatio";
import BorrowDataCollRatio2 from "../BorrowDataCollRatio2";
import "./Asset2.css";

function Asset2(props) {
  const {
    borrowDataCollRatioProps,
    borrowDataCollRatio2Props,
    borrowDataCollRatio22Props,
    borrowDataCollRatio2Props2,
    borrowDataCollRatio3Props,
  } = props;

  return (
    <div className="asset-1">
      <div className="asset-2 valign-text-middle oxanium-normal-white-20px">Asset</div>
      <div className="overlap-group1-1">
        <img className="nft-avatar" src="/img/nft-avatar@2x.png" />
        <div className="flex-col-10 oxanium-normal-black-20px">
          <div className="fidenza-157-3 valign-text-middle">Fidenza #157</div>
          <div className="flex-col-item valign-text-middle">Status: ESCROW</div>
          <div className="flex-col-item valign-text-middle">
            <span>
              <span className="oxanium-normal-black-20px">Owner: </span>
              <span className="span1 oxanium-normal-black-20px">0x123456</span>
              <span className="oxanium-normal-black-20px"></span>
            </span>
          </div>
          <div className="flex-col-item valign-text-middle">
            <span>
              <span className="oxanium-normal-black-20px">Opensea: </span>
              <span className="span1 oxanium-normal-black-20px">0x987123</span>
              <span className="oxanium-normal-black-20px"></span>
            </span>
          </div>
          <div className="overlap-group-12">
            <BorrowDataCollRatio maturity={borrowDataCollRatioProps.maturity} d={borrowDataCollRatioProps.d} />
            <BorrowDataCollRatio2
              collateralRatio={borrowDataCollRatio2Props.collateralRatio}
              percent={borrowDataCollRatio2Props.percent}
            />
            <BorrowDataCollRatio2
              collateralRatio={borrowDataCollRatio22Props.collateralRatio}
              percent={borrowDataCollRatio22Props.percent}
              className={borrowDataCollRatio22Props.className}
            />
            <BorrowDataCollRatio
              maturity={borrowDataCollRatio2Props2.maturity}
              d={borrowDataCollRatio2Props2.d}
              className={borrowDataCollRatio2Props2.className}
            />
            <BorrowDataCollRatio
              maturity={borrowDataCollRatio3Props.maturity}
              d={borrowDataCollRatio3Props.d}
              className={borrowDataCollRatio3Props.className}
            />
            <div className="borrow-data-container"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Asset2;
