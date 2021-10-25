import React from "react";
import AssetItem from "../AssetItem";
import ButtonBorrow from "../ButtonBorrow";
import ButtonRepay from "../ButtonRepay";
import TokenBorrow from "../TokenBorrow";
import "./Borrow.css";

function Borrow(props) {
  const { buttonBorrowProps, buttonRepayProps, tokenBorrowProps } = props;

  return (
    <div className="borrow-6">
      <div className="overlap-group-13">
        <div className="rectangle-17-1"></div>
        <div className="number-1 valign-text-middle oxanium-normal-black-24px">50</div>
        <div className="text valign-text-middle oxanium-normal-black-25px">50.02</div>
        <div className="percent-3 valign-text-middle oxanium-normal-black-25px">30%</div>
        <AssetItem />
        <ButtonBorrow>{buttonBorrowProps.children}</ButtonBorrow>
        <ButtonRepay>{buttonRepayProps.children}</ButtonRepay>
        <div className="x175-min-150-1 valign-text-middle oxanium-bold-black-20px">
          <span>
            <span className="oxanium-bold-black-20px">
              175%
              <br />
            </span>
            <span className="oxanium-normal-black-20px">Min. 150%</span>
          </span>
        </div>
        <div className="text-4 valign-text-middle oxanium-bold-black-20px">
          <span>
            <span className="oxanium-bold-black-20px">
              21-DEC-2022
              <br />
            </span>
            <span className="oxanium-normal-black-20px">2d 2h 22m</span>
          </span>
        </div>
        <TokenBorrow className={tokenBorrowProps.className} />
      </div>
    </div>
  );
}

export default Borrow;
