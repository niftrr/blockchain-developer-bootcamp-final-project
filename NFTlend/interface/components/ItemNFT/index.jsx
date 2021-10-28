import React from "react";
import "./ItemNFT.css";

function ItemNFT(props) {
  const { rectangle32, fidenza157 } = props;

  return (
    <div className="item-nft">
      <div className="rectangle-33 border-1px-pickled-bluewood"></div>
      <img className="rectangle-32" src={rectangle32} />
      <div className="fidenza-157-3 valign-text-middle oxanium-normal-black-20px">{fidenza157}</div>
    </div>
  );
}

export default ItemNFT;
