import React from "react";
import "./InputDropdown.css";
import { useAppContext } from "../../AppContext";

function InputDropdown(props) {
  const { className } = props;
  const { setBorrowToken } = useAppContext();

  const handleBorrowTokenInput = (value) => {
    setBorrowToken(value);
    console.log('handleBorrowTokenInput', value);
  }

  return (
      <select onChange={(e) => handleBorrowTokenInput(e.target.value)} className={`input-dropdown ${className || ""}`} id="tokens" name="tokens">
      <option value="ETH" defaultChecked>ETH</option>
      <option value="DAI">DAI</option>
      <option value="USDC">USDC</option>
      </select>
  );
}

export default InputDropdown;
