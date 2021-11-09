import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import "./BorrowDataCollRatio2.css";
import { useAppContext } from "../../AppContext";

function BorrowDataCollRatio(props) {
  const { account } = useWeb3React();
  const { collateralRatio, className } = props;
  const { borrowCollRatio } = useAppContext();

  useEffect(() => {
    if (account) {
      borrowCollRatio;
    }  
  }, [account]);

  return (
    <div className={`borrow-data-coll-ratio-2 oxanium-normal-black-20px ${className || ""}`}>
      <div className="apr-1 valign-text-middle">{collateralRatio}</div>
      <div className="percent-3 valign-text-middle">{Number(borrowCollRatio).toFixed(1)}%</div>
    </div>
  );
}

export default BorrowDataCollRatio;
