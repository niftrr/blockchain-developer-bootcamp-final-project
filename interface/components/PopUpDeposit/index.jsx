import React, { useState, useEffect } from "react";
import "./PopUpDeposit.css";
import { useAppContext } from "../../AppContext";
import useLendingPool from "../../hooks/useLendingPool";
import TransactionStatus from "../TransactionStatus";
import useTransaction from "../../hooks/useTransaction";
import { useWeb3React } from "@web3-react/core";


function PopUp(props) {
  const { token } = props;
  const { account } = useWeb3React();
  const { borrowNFT, borrowProject, imageDictBorrow } = useAppContext();
  const { deposit } = useLendingPool();
  const { txnStatus } = useTransaction();
  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => {
    if (account) {
      txnStatus
    }    
  }, [account]);

  const tokenImage = {
    "DAI": "/img/rectangle-16@2x.png",
    "ETH": "/img/rectangle-19@2x.png",
    "USDC": "/img/rectangle-22@2x.png"
  }

  const handleDepositSubmit = () => {
    deposit(token, depositAmount);
  }

  return (
    <div className="pop-up">
      <div className="pop-up-text-1 valign-text-middle oxanium-bold-web-orange-32px">
        <span>
          <span className="oxanium-bold-web-orange-32px">How much would you like to deposit?<br></br><br></br></span>
          <span className="oxanium-extra-light-web-orange-24px">Please enter an amount you would like to deposit in {token}.</span>
        </span>
      </div>
      <TransactionStatus />
      <div className="overlap-group1-1 border-1px-black">
        <img className="rectangle-19-4" src={tokenImage[token]} />
        <input
          className="x19111-1 oxanium-normal-black-24px"
          name="19111"
          placeholder="0.00"
          type="text"
          value={depositAmount} 
          onChange={(e) => {
            setDepositAmount(e.target.value);
            }}
        />
        <div className="overlap-group-15">
          <button onClick={() => {}} className="popup-deposit-name valign-text-middle oxanium-bold-web-orange-24px">MAX</button>
        </div>
      </div>
      <div onClick={handleDepositSubmit}  className="overlap-group-16">
        <button onClick={handleDepositSubmit} className="rectangle-47-1"></button>
        <div className="place-11 valign-text-middle oxanium-normal-white-24px">Deposit</div>
      </div>
    </div>
  );
}

export default PopUp;
