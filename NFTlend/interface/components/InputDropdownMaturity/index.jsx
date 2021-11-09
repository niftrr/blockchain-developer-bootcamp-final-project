import React from "react";
import "./InputDropdown.css";
import { useAppContext } from "../../AppContext";

function InputDropdown(props) {
  const { className } = props;
  const { setBorrowMaturity } = useAppContext();

  const handleBorrowMaturityInput = (value) => {
    setBorrowMaturity(value);
    console.log('handleBorrowMaturityInput', value);
  }

  return (
      <select onChange={(e) => handleBorrowMaturityInput(e.target.value)} className={`input-dropdown ${className || ""}`} id="maturity" name="maturity">
      <option value="1" defaultChecked>1 Week</option>
      <option value="4">4 Weeks</option>
      <option value="13">3 Months</option>
      <option value="26">6 Months</option>
      </select>
  );
}

export default InputDropdown;
