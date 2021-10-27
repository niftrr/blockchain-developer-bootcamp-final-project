import React from "react";
import "./PopUp.css";

function PopUp(props) {
  const { x, spanText, spanText2, rectangle19, inputType, inputPlaceholder, name, place } = props;

  return (
    <div className="pop-up">
      <div className="pop-up-text valign-text-middle oxanium-bold-web-orange-32px">
        <span>
          <span className="oxanium-bold-web-orange-32px">How much would you like to deposit?<br></br><br></br></span>
          <span className="oxanium-extra-light-web-orange-24px">Please enter an amount you would like to deposit.</span>
        </span>
      </div>
      <div className="pop-up-overlap-group1-1">
        <img className="pop-up-rectangle-19-3" src="/img/rectangle-19@2x.png" />
        <input
          className="x19111 oxanium-normal-black-24px"
          name="19111"
          placeholder="0.0000"
          type="text"
        />
        <div className="pop-up-overlap-group-13">
          <button className="pop-up-name valign-text-middle oxanium-bold-web-orange-24px">MAX</button>
        </div>
      </div>
      <button className="pop-up-overlap-group-14">
        <div className="pop-up-rectangle-47"></div>
        <div className="pop-up-place-9 valign-text-middle">Deposit</div>
      </button>
    </div>
  );
}

export default PopUp;
