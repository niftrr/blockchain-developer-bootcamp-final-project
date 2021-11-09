import React from "react";
import "./BorrowDataCollRatio2.css";
import { useAppContext } from "../../AppContext";

function BorrowDataCollRatio2(props) {
  const { collateralRatio } = props;
  const { borrowAPR } = useAppContext();

  return (
    <div className={`borrow-data-coll-ratio-2 oxanium-normal-black-20px`}>
      <div className="apr-1 valign-text-middle">{collateralRatio}</div>
      <div className="percent-3 valign-text-middle">{borrowAPR}</div>
    </div>
  );
}

export default BorrowDataCollRatio2;
