import React from "react";
import "./InputDropdown.css";

function InputDropdown(props) {
  const { className } = props;

  return (
      <select className={`input-dropdown ${className || ""}`} id="maturity" name="maturity">
      <option value="1wk">1 Week</option>
      <option value="2wk">4 Weeks</option>
      <option value="13wk">3 Months</option>
      <option value="26wk">6 Months</option>
      </select>
  );
}

export default InputDropdown;
