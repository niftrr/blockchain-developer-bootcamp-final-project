import React from "react";
import "./InputDropdown.css";
import { useAppContext } from "../../AppContext";

function InputDropdown(props) {
  const { className } = props;
  const { setBorrowToken } = useAppContext();

  const handleBorrowTokenInput = (value) => {
    setBorrowToken(value);
  }

  return (
      <select onChange={(e) => handleBorrowTokenInput(e.target.value)} className={`input-dropdown ${className || ""}`} id="tokens" name="tokens">
      <option value="WETH" defaultChecked>WETH</option>
      <option value="DAI">DAI</option>
      <option value="USDC">USDC</option>
      </select>
  );
}

export default InputDropdown;
