import React from "react";
import { Link } from "react-router-dom";
import "./ButtonBorrow.css";
import { useAppContext } from "../../AppContext";
import PopUpTokensDeposit from '../PopUpTokensDeposit';
import PopUpBorrow from "../PopUpBorrow";
import Popup from 'reactjs-popup';

function ButtonBorrow(props) {
  const { children, className } = props;
  const { borrowCollRatio } = useAppContext();

  if (Number(borrowCollRatio) < 150) {
    return (
      <button disabled className={`borrow-button-deposit-3-disabled ${className || ""}`}>
        <div className="borrow-place-9-disabled valign-text-middle oxanium-normal-white-20px">{children}</div>
      </button>
    );    
  } else {
    return (
      <Popup modal trigger={
      <button className={`borrow-button-deposit-3 ${className || ""}`}>
        <div className="borrow-place-9 valign-text-middle oxanium-normal-white-20px">{children}</div>
      </button>} modal nested>
      <PopUpBorrow />
    </Popup>
    );
  }
}

export default ButtonBorrow;
