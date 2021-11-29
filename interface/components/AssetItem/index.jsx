import React from "react";
import { Link } from "react-router-dom";
import "./AssetItem.css";

function AssetItem(props) {
  const { className, nftSymbol, nftTokenId, imgUrl } = props;

  return (
    // <Link to="/asset">
      <div className={`asset-item-3 ${className || ""}`}>
        <img className="rectangle-18" src={imgUrl} />
        <div className="fidenza-157 valign-text-middle oxanium-semi-bold-black-20px">
          <span>
            <span className="span-2 oxanium-semi-bold-black-20px">
              {nftSymbol}
              <br />
            </span>
            <span className="span-2 oxanium-normal-black-20px">#{nftTokenId}</span>
          </span>
        </div>
      </div>
    // </Link>
  );
}

export default AssetItem;
