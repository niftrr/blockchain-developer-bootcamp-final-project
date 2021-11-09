import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import "./BorrowDataCollRatio2.css";
import { useAppContext } from "../../AppContext";
import { useCollateralManager } from "../../hooks/useCollateralManager";

function BorrowDataCollRatio2(props) {
  const { collateralRatio } = props;
  const { account } = useWeb3React();
  const { borrowProject, borrowAPR } = useAppContext();
  const { fetchAPR, fetchBorrowAPR } = useCollateralManager();

  useEffect(() => {
    if (account) {
      fetchAPR();
      fetchBorrowAPR(borrowProject);
    }  
  }, [account, borrowProject]);

  return (
    <div className={`borrow-data-coll-ratio-2 oxanium-normal-black-20px`}>
      <div className="apr-1 valign-text-middle">{collateralRatio}</div>
      <div className="percent-3 valign-text-middle">{borrowAPR}</div>
    </div>
  );
}

export default BorrowDataCollRatio2;
