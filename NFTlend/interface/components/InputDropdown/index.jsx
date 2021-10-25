import React from "react";
import "./InputDropdown.css";

function InputDropdown(props) {
  const { className } = props;

  return (
    <div className={`input-dropdown ${className || ""}`}>
      <img className="polygon-1" src="/img/polygon-3@2x.svg" />
    </div>
  );
}

export default InputDropdown;
