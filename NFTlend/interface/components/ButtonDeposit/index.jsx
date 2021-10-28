import React from "react";
import { Link } from "react-router-dom";
import "./ButtonDeposit.css";
import PopUpTokensDeposit from '../PopUpTokensDeposit';
import Popup from 'reactjs-popup';


function ButtonBorrow(props) {
  const { children, className, ethBalance, daiBalance } = props;

  return (
    <Popup modal trigger={
    <div className={`button-deposit-3 ${className || ""}`}>
      <div className="place-9 valign-text-middle oxanium-normal-white-20px">{children}</div>
    </div>} modal nested>
      <PopUpTokensDeposit ethBalance={ethBalance} daiBalance={daiBalance} />
    </Popup>
  );
}

export default ButtonBorrow;
