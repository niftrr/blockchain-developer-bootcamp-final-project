import React from "react";
import AssetItem from "../AssetItem";
import ButtonRepay from "../ButtonRepay";
import TokenBorrow from "../TokenBorrow";
import "./Borrow.css";

function Borrow() {
  return (
    <div className="borrow-6">
      <div className="overlap-group-13">
        <div className="rectangle-17"></div>
        <div className="number valign-text-middle oxanium-normal-black-24px">50</div>
        <div className="text valign-text-middle oxanium-normal-black-25px">50.02</div>
        <div className="percent valign-text-middle oxanium-normal-black-25px">30%</div>
        <AssetItem />
        <ButtonRepay />
        <div className="x175-min-150 valign-text-middle oxanium-bold-black-20px">
          <span>
            <span className="oxanium-bold-black-20px">
              175%
              <br />
            </span>
            <span className="oxanium-normal-black-20px">Min. 150%</span>
          </span>
        </div>
        <div className="text-1 valign-text-middle oxanium-bold-black-20px">
          <span>
            <span className="oxanium-bold-black-20px">
              21-DEC-2022
              <br />
            </span>
            <span className="oxanium-normal-black-20px">2d 2h 22m</span>
          </span>
        </div>
        <TokenBorrow />
      </div>
    </div>
  );
}

export default Borrow;
