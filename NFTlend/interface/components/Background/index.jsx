import React from "react";
import "./Background.css";

function Background(props) {
  const { className } = props;

  return (
    <div className={`background ${className || ""}`}>
      <div className="flex-col">
        <img className="bored-ape-logo-outline-1" src="/img/bored-ape-logo-outline-1@2x.png" />
        <img className="punk-woman-outl-ovebg-preview-1" src="/img/punk-woman-outline-removebg-preview-1@2x.png" />
      </div>
      <div className="flex-col-1">
        <img className="punk-pipe-outli-ovebg-preview-1" src="/img/punk-pipe-outline-removebg-preview-1@2x.png" />
        <div className="overlap-group-6">
          <img className="coolcat-outline-ovebg-preview-1" src="/img/coolcat-outline-removebg-preview-1@2x.png" />
          <img className="punk-ape-outlin-ovebg-preview-1" src="/img/punk-ape-outline-removebg-preview-1@2x.png" />
          <img className="bbape-removebg-convert-image-2" src="/img/bb-ape-removebg-preview-convertimage-2@2x.png" />
          <img className="loading-skull-noun-2" src="/img/loading-skull-noun-2@2x.png" />
        </div>
      </div>
    </div>
  );
}

export default Background;
