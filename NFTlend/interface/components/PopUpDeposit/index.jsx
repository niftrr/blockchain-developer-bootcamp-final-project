import React, { useState } from "react";
import "./PopUpDeposit.css";

function PopUp(props) {
  const { x, spanText, spanText2, rectangle19, inputType, inputPlaceholder, name, place, token } = props;

  const [inputValue, setInputValue] = useState(0.0);

  const tokenImage = {
    "DAI": "/img/rectangle-16@2x.png",
    "ETH": "/img/rectangle-19@2x.png",
    "USDC": "/img/rectangle-22@2x.png"
  }

  function onTodoChange(value) {
    setInputValue(value);
    return inputValue;
  }

  return (
    <div className="pop-up">
      <div className="pop-up-text-1 valign-text-middle oxanium-bold-web-orange-32px">
        <span>
          <span className="oxanium-bold-web-orange-32px">How much would you like to deposit?<br></br><br></br></span>
          <span className="oxanium-extra-light-web-orange-24px">Please enter an amount you would like to deposit in {token}.</span>
        </span>
      </div>
      <div className="overlap-group1-1 border-1px-black">
        <img className="rectangle-19-4" src={tokenImage[token]} />
        <input
          className="x19111-1 oxanium-normal-black-24px"
          name="19111"
          placeholder={inputValue}
          type="text"
        />
        <div className="overlap-group-15">
          <button onClick={() => {}} className="popup-deposit-name valign-text-middle oxanium-bold-web-orange-24px">MAX</button>
        </div>
      </div>
      <div className="overlap-group-16">
        <button className="rectangle-47-1"></button>
        <div className="place-11 valign-text-middle oxanium-normal-white-24px">Deposit</div>
      </div>
    </div>
  );
}

export default PopUp;
