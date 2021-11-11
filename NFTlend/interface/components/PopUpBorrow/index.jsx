import React, { useEffect } from "react";
import BorrowDataValues from "../BorrowDataValues";
import BorrowDataAmounts from "../BorrowDataAmounts";
import "./PopUpBorrow.css";
import { useAppContext } from "../../AppContext";
import useTransaction from "../../hooks/useTransaction";
import { useWeb3React } from "@web3-react/core";
import useNFT from "../../hooks/useNFT";
import useLendingPool from "../../hooks/useLendingPool";
import TransactionStatus from "../TransactionStatus";

function PopUpBorrow(props) {
  const {
    nftAvatar,
  } = props;
  const { account } = useWeb3React();
  const {txnStatus} = useTransaction();
  const { 
    borrowProject, 
    borrowNFT, 
    borrowToken,
    borrowAmount,
    borrowAPR,
    borrowCollRatio,
    borrowMaturity} = useAppContext();
    const { 
      fetchImagesPUNK, 
      fetchImagesBAYC,
      imageDictPUNK, imageDictBAYC } = useNFT();
    const { borrow } = useLendingPool();

  useEffect(() => {
    if (account) {
      txnStatus
      fetchImagesPUNK();
      fetchImagesBAYC();
    }    
  }, [account]);

  function visible(nftSymbol) {
    let visibility = "nft-avatar-1-hidden";
    if (nftSymbol == borrowProject) {
      visibility = "nft-avatar-1-borrowPopUp";
    }
    return visibility
  } 

  const handleBorrowSubmit = () => {
    console.log('handleBorrowSubmit called');
    borrow(
      borrowToken, 
      borrowAmount, 
      borrowProject, 
      borrowNFT, 
      borrowAPR,
      borrowMaturity);
  }

  return (
    // <div className="container-center-horizontal">
        <div className="overlap-group1-borrowPopUp">
          <div className="pop-up-text-borrowPopUp valign-text-middle oxanium-bold-web-orange-32px">
            <span>
              <span className="oxanium-bold-web-orange-32px">Confirm Borrow.</span><br></br><br></br>
              <span className="oxanium-extra-light-web-orange-24px">Please confirm borrow to access instant liquidity.</span>
            </span>
          </div>
          <TransactionStatus />
          <div className="borrow-details-borrowPopUp">
            <div className="nft-avatar-borrowPopUp">
              <img className={visible("PUNK")} src={imageDictPUNK[borrowNFT]}/>
              <img className={visible("BAYC")} src={imageDictBAYC[borrowNFT]} />
            </div>
            <div className="borrow-data-borrowPopUp oxanium-normal-black-20px">
              <div className="borrow-data-collateral-borrowPopUp">
                <div className="collateral-borrowPopUp valign-text-middle">Collateral:</div>
                <div className="fidenza-157-borrowPopUp valign-text-middle">{borrowProject}#{borrowNFT}</div>
              </div>
              <BorrowDataAmounts
                borrowAmount="Borrow Amount"
                amount={borrowAmount}
                token={borrowToken}
              />
              <div className="borrow-data-coll-ratio-borrowPopUp">
                <div className="text-1-borrowPopUp valign-text-middle">Collateralization Ratio:</div>
                <div className="percent-borrowPopUp valign-text-middle">{Number(borrowCollRatio).toFixed(1)}%</div>
              </div>
              <BorrowDataValues
                borrowAmount="Maturity"
                address={borrowMaturity}
                className="borrow-data-coll-ratio-1-1"
              />
              <BorrowDataAmounts
                borrowAmount="Repayment Amount:"
                amount={String(Number(borrowAmount*(1 + borrowAPR/100*borrowMaturity/52)).toFixed(4))}
                token={borrowToken}
                className="borrow-data-coll-ratio-1"
              />
            </div>
          </div>
          <div onClick={handleBorrowSubmit} className="overlap-group-borrowPopUp">
            <button onClick={handleBorrowSubmit} className="rectangle-47-borrowPopUp"></button>
            <div className="borrow-borrowPopUp valign-text-middle oxanium-normal-white-24px">Borrow</div>
          </div>
        </div>
    // </div>
  );
}

export default PopUpBorrow;
