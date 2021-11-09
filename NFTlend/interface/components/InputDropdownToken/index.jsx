import React from "react";
import "./InputDropdown.css";

function InputDropdown(props) {
  const { className } = props;

  return (
    // <div className={`input-dropdown ${className || ""}`}>
    //   <img className="polygon-1" src="/img/polygon-3@2x.svg" />
    // </div>
    // <div className={`input-dropdown ${className || ""}`}>
      <select className={`input-dropdown ${className || ""}`} id="tokens" name="tokens">
      <option value="eth">ETH</option>
      <option value="dai">DAI</option>
      <option value="USDC">USDC</option>
      </select>
  //  </div>
  );
}

export default InputDropdown;
