import React from "react";
import "./ButtonBorrow.css";
import Popup from 'reactjs-popup';
import PopUpTokens from '../PopUpTokens';

function ButtonBorrow(props) {
  const { children, className } = props;

  return (
    <Popup modal trigger={
      <button className={`button-borrow-2 ${className || ""}`}>
        <div className="borrow-7 valign-text-middle oxanium-normal-white-20px">{children}</div>
      </button>
    } modal nested>
    <PopUpTokens />
  </Popup>
  );
}

export default ButtonBorrow;
