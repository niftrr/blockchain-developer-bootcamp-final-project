import React from "react";
import TokenBorrow from "../TokenBorrow";
import AssetItem from "../AssetItem";
import "./PreviousBorrow.css";

function PreviousBorrow(props) {
  const {
    number,
    text26,
    percent,
    rectangle19,
    place,
    x0X123456,
    repaid,
    spanText,
    spanText2,
    spanText3,
    spanText4,
    tokenBorrowProps,
    assetItemProps,
  } = props;

  return (
    <div className="previous-borrow">
      <div className="overlap-group-20">
        <div className="rectangle-17-1"></div>
        <div className="number-1 valign-text-middle oxanium-normal-black-24px">{number}</div>
        <div className="text-26 valign-text-middle oxanium-normal-black-25px">{text26}</div>
        <div className="percent-5 valign-text-middle oxanium-normal-black-25px">{percent}</div>
        <div className="group-1">
          <img className="rectangle-19-5" src={rectangle19} />
          <div className="place-13 valign-text-middle oxanium-normal-black-24px">{place}</div>
        </div>
        <div className="x0x123456 valign-text-middle oxanium-normal-black-20px">{x0X123456}</div>
        <div className="repaid valign-text-middle oxanium-normal-black-25px">{repaid}</div>
        <div className="x175-min-150-1 valign-text-middle oxanium-bold-black-20px">
          <span>
            <span className="oxanium-bold-black-20px">{spanText}</span>
            <span className="oxanium-normal-black-20px">{spanText2}</span>
          </span>
        </div>
        <div className="text-27 valign-text-middle oxanium-bold-black-20px">
          <span>
            <span className="oxanium-bold-black-20px">{spanText3}</span>
            <span className="oxanium-normal-black-20px">{spanText4}</span>
          </span>
        </div>
        <TokenBorrow className={tokenBorrowProps.className} />
        <AssetItem className={assetItemProps.className} />
      </div>
    </div>
  );
}

export default PreviousBorrow;
