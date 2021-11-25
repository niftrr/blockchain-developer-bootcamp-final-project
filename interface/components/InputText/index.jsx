import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import "./InputText.css";
import { useAppContext } from "../../AppContext";
import useLendingPool from "../../hooks/useLendingPool";

function InputText(props) {
  const { children } = props;
  const { account } = useWeb3React();
  const { setBorrowAmount, setBorrowCollRatio, borrowToken, borrowFloorPrice } = useAppContext();
  const { fetchBorrowFloorPrice } = useLendingPool();

  useEffect(() => {
    if (account) {
      fetchBorrowFloorPrice();
    }  
  }, [account, borrowToken, borrowFloorPrice]);

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
