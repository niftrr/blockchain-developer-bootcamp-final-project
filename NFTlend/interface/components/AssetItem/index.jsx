import React from "react";
import { Link } from "react-router-dom";
import "./AssetItem.css";

function AssetItem(props) {
  const { className } = props;

  return (
    <Link to="/asset">
      <div className={`asset-item-3 ${className || ""}`}>
        <img className="rectangle-18" src="/img/rectangle-18@2x.png" />
        <div className="fidenza-157 valign-text-middle oxanium-semi-bold-black-20px">
          <span>
            <span className="span-2 oxanium-semi-bold-black-20px">
              Fidenza
              <br />
            </span>
            <span className="span-2 oxanium-normal-black-20px">#157</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default AssetItem;
