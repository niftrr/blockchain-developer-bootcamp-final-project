import React, { useState, useEffect } from "react";
import "./PopUpWithdraw.css";
import { useAppContext } from "../../AppContext";
import useLendingPool from "../../hooks/useLendingPool";
import useTransaction from "../../hooks/useTransaction";
import TransactionStatus from "../TransactionStatus";
import { useWeb3React } from "@web3-react/core";

function PopUp(props) {
  const { token } = props;
  const { account } = useWeb3React();
  const { withdraw } = useLendingPool();
  const {txnStatus} = useTransaction();
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const tokenImage = {
    "DAI": "/img/rectangle-16@2x.png",
    "ETH": "/img/rectangle-19@2x.png",
    "USDC": "/img/rectangle-22@2x.png"
  }

  useEffect(() => {
    if (account) {
      txnStatus
    }    
  }, [account]);

  const handleWithdrawSubmit = () => {
    withdraw(token, withdrawAmount);
  }

  return (
    <div className="pop-up">
      <div className="pop-up-text-1 valign-text-middle oxanium-bold-web-orange-32px">
        <span>
          <span className="oxanium-bold-web-orange-32px">How much would you like to withdraw?<br></br><br></br></span>
          <span className="oxanium-extra-light-web-orange-24px">Please enter an amount you would like to withdraw in {token}.</span>
        </span>
      </div>
      <TransactionStatus />
      <div className="overlap-group1-1 border-1px-black">
        <img className="rectangle-19-4" src={tokenImage[token]} />
        <input
          className="x19111-1 oxanium-normal-black-24px"
          name="19111"
          placeholder="0.000"
          type="text"
          value={withdrawAmount}
          onChange={(e) => {
            setWithdrawAmount(e.target.value);
            }}    
        />
        <div className="overlap-group-15">
          <div className="popup-withdraw-name valign-text-middle oxanium-bold-web-orange-24px">MAX</div>
        </div>
      </div>
      <div onClick={handleWithdrawSubmit} className="overlap-group-16">
        <button onClick={handleWithdrawSubmit} className="rectangle-47-1"></button>
        <div className="place-11 valign-text-middle oxanium-normal-white-24px">Withdraw</div>
      </div>
    </div>
  );
}

export default PopUp;
