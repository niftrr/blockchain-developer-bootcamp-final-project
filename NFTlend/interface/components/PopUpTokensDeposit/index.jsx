import React from "react";
import PopUpDeposit from "../PopUpDeposit";
import "./PopUpTokensDeposit.css";

function PopUpTokensDeposit(props) {
  const { popUpProps, ethBalance, daiBalance } = props;

  return (
    <div className="container-center-horizontal">
      <PopUpDeposit {...popUpProps} ethBalance={ethBalance} daiBalance={daiBalance} />
    </div>
  );
}

export default PopUpTokensDeposit;
