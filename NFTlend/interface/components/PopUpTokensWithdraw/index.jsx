import React from "react";
import PopUpWithdraw from "../PopUpWithdraw";
import "./PopUpTokensWithdraw.css";

function PopUpTokensWithdraw(props) {
  const { popUpProps } = props;

  return (
    <div className="container-center-horizontal">
      <PopUpWithdraw {...popUpProps} />
    </div>
  );
}

export default PopUpTokensWithdraw;
