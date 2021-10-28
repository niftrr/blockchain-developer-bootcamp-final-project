import React from "react";
import "./PopUpDeposit.css";

function PopUp(props) {
  const { x, spanText, spanText2, rectangle19, inputType, inputPlaceholder, name, place } = props;

  return (
    <div className="pop-up">
      <div className="pop-up-text-1 valign-text-middle oxanium-bold-web-orange-32px">
        <span>
          <span className="oxanium-bold-web-orange-32px">How much would you like to deposit?<br></br><br></br></span>
          <span className="oxanium-extra-light-web-orange-24px">Please enter an amount you would like to deposit.</span>
        </span>
      </div>
      <div className="overlap-group1-1 border-1px-black">
        <img className="rectangle-19-4" src="/img/rectangle-19@2x.png" />
        <input
          className="x19111-1 oxanium-normal-black-24px"
          name="19111"
          placeholder="0.0000"
          type="text"
        />
        <div className="overlap-group-15">
          <button className="popup-deposit-name valign-text-middle oxanium-bold-web-orange-24px">MAX</button>
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
