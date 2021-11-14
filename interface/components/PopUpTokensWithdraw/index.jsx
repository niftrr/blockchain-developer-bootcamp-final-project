import React from "react";
import PopUpWithdraw from "../PopUpWithdraw";
import "./PopUpTokensWithdraw.css";

function PopUpTokensWithdraw(props) {
  const { popUpProps, token } = props;

  return (
    <div className="container-center-horizontal">
      <PopUpWithdraw {...popUpProps} token={token} />
    </div>
  );
}

export default PopUpTokensWithdraw;
