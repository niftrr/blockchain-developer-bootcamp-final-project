import React from "react";
import PopUp from "../PopUp";
import "./PopUpTokens.css";

function PopUpTokens(props) {
  const { popUpProps } = props;

  return (
    <div className="container-center-horizontal">
      <div className="popuptokens screen">
        <PopUp {...popUpProps} />
      </div>
    </div>
  );
}

export default PopUpTokens;
