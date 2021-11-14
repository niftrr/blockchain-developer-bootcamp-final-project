import React, { useEffect } from "react";
import { useAppContext } from "../../AppContext";
import "./ItemProject.css";

function ItemProject(props) {
  const { className, nftSymbol } = props;
  const { setBorrowProject, borrowProject } = useAppContext();
  
  const nftProjectImage = {
    "PUNK": "/img/rectangle-18-4@2x.png",
    "BAYC": "/img/rectangle-18-5@2x.png",
  }

  const handleChange = (nftSymbol) => {
    if (nftSymbol == borrowProject) {
      setBorrowProject("--");
    } else {
      setBorrowProject(nftSymbol);
      console.log('setting borrowProject to', nftSymbol);
    }
  }

  return (
    <div className={`item-project ${className || ""}`}>
      <input type="checkbox" onChange={() => handleChange(nftSymbol)} className="rectangle-31 border-1px-pickled-bluewood"></input>
      <img className="rectangle-18-3" src={nftProjectImage[nftSymbol]} />
      <div className="place-12 valign-text-middle oxanium-normal-black-20px">{nftSymbol}</div>
    </div>
  );
}

export default ItemProject;
