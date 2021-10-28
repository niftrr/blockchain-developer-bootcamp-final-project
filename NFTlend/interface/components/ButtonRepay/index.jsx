import React from "react";
import { Link } from "react-router-dom";
import "./ButtonRepay.css";
import PopUpNFTs from '../PopUpNFTs';
import Popup from 'reactjs-popup';

function ButtonRepay() {
  return (
    <Popup modal trigger={
      <div className="button-repay">
        <button className="overlap-group-14">
            <div className="rectangle-11"></div>
          <div className="repay-1 valign-text-middle oxanium-normal-white-20px">Repay</div>
        </button>
      </div>} modal nested>
      <PopUpNFTs />
      </Popup>
  );
}

export default ButtonRepay;
