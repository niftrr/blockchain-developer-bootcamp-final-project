import React from "react";
import "./PopUpWithdraw.css";

function PopUp(props) {
  const { x, spanText, spanText2, rectangle19, inputType, inputPlaceholder, name, place, token } = props;
  
  const tokenImage = {
    "DAI": "/img/rectangle-16@2x.png",
    "ETH": "/img/rectangle-19@2x.png",
    "USDC": "/img/rectangle-22@2x.png"
  }

  return (
    <div className="pop-up">
      <div className="pop-up-text-1 valign-text-middle oxanium-bold-web-orange-32px">
        <span>
          <span className="oxanium-bold-web-orange-32px">How much would you like to withdraw?<br></br><br></br></span>
          <span className="oxanium-extra-light-web-orange-24px">Please enter an amount you would like to withdraw in {token}.</span>
        </span>
      </div>
      <div className="overlap-group1-1 border-1px-black">
        <img className="rectangle-19-4" src={tokenImage[token]} />
        <input
          className="x19111-1 oxanium-normal-black-24px"
          name="19111"
          placeholder="0.0000"
          type="text"
        />
        <div className="overlap-group-15">
          <div className="popup-withdraw-name valign-text-middle oxanium-bold-web-orange-24px">MAX</div>
        </div>
      </div>
      <div className="overlap-group-16">
        <div className="rectangle-47-1"></div>
        <div className="place-11 valign-text-middle oxanium-normal-white-24px">Withdraw</div>
      </div>
    </div>
  );
}

export default PopUp;
