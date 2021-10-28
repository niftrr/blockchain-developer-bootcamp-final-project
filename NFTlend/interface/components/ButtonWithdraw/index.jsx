import React from "react";
import { Link } from "react-router-dom";
import "./ButtonWithdraw.css";
import PopUpTokensWithdraw from '../PopUpTokensWithdraw';
import Popup from 'reactjs-popup';


function ButtonBorrow(props) {
  const { children, className } = props;

  return (
    <Popup modal trigger={
    <button className={`button-withdraw-2 ${className || ""}`}>
      <div className="withdraw valign-text-middle oxanium-normal-black-20px">{children}</div>
    </button>} modal nested>
      <PopUpTokensWithdraw />
    </Popup>
  );
}

export default ButtonBorrow;
