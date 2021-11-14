import React from "react";
import PopUpDeposit from "../PopUpDeposit";
import "./PopUpTokensDeposit.css";

function PopUpTokensDeposit(props) {
  const { popUpProps, token } = props;

  return (
    <div className="container-center-horizontal">
      <PopUpDeposit {...popUpProps} token={token} />
    </div>
  );
}

export default PopUpTokensDeposit;
