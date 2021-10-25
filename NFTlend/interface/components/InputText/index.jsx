import React from "react";
import "./InputText.css";

function InputText(props) {
  const { children } = props;

  return (
    <div className="input-text">
      <div className="phone valign-text-middle">{children}</div>
    </div>
  );
}

export default InputText;
