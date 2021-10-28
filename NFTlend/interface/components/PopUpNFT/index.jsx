import React from "react";
import "./PopUpNFT.css";

function PopUpNFT(props) {
  const { spanText, spanText2, nftAvatar, rectangle19, inputType, inputPlaceholder, repay } = props;

  return (
    <div className="pop-up-nft">
      <div className="pop-up-text valign-text-middle oxanium-bold-web-orange-32px">
        <span>
          <span className="oxanium-bold-web-orange-32px">{spanText}<br></br><br></br></span>
          <span className="oxanium-extra-light-web-orange-24px">{spanText2}</span>
        </span>
      </div>
      <img className="nft-avatar" src={nftAvatar} />
      <div className="overlap-group1 border-1px-black">
        <img className="rectangle-19" src={rectangle19} />
        <input
          className="x19111 oxanium-normal-black-24px"
          name="19111"
          placeholder={inputPlaceholder}
          type={inputType}
        />
      </div>
      <div className="overlap-group">
        <div className="rectangle-47"></div>
        <div className="repay valign-text-middle oxanium-normal-white-24px">{repay}</div>
      </div>
    </div>
  );
}

export default PopUpNFT;
