import React from "react";
import PopUpDeposit from "../PopUpDeposit";
import "./PopUpTokensDeposit.css";

function PopUpTokensDeposit(props) {
  const { popUpProps } = props;

  return (
    <div className="container-center-horizontal">
      <PopUpDeposit {...popUpProps} />
    </div>
  );
}

export default PopUpTokensDeposit;
