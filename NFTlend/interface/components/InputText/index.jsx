import React from "react";
import "./InputText.css";
import { useAppContext } from "../../AppContext";

function InputText(props) {
  const { children } = props;
  const { setBorrowAmount, setBorrowCollRatio, borrowCollRatio, borrowFloorPrice } = useAppContext();

  const handleBorrowAmountInput = (value) => {
    setBorrowAmount(value);
    const collRatio = 100* borrowFloorPrice / value;
    setBorrowCollRatio(collRatio);
  }

  return (
    <div className="input-text">
      <input type="text" name="borrowAmount" onChange={(e) => handleBorrowAmountInput(e.target.value)} placeholder="0.0000" className="phone valign-text-middle"></input>
    </div>
  );
}

export default InputText;
