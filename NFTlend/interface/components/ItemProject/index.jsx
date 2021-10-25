import React from "react";
import "./ItemProject.css";

function ItemProject(props) {
  const { className } = props;

  return (
    <div className={`item-project ${className || ""}`}>
      <div className="rectangle-31 border-1px-pickled-bluewood"></div>
      <img className="rectangle-18-3" src="/img/rectangle-18-3@2x.png" />
      <div className="place-10 valign-text-middle oxanium-normal-black-20px">Fidenza</div>
    </div>
  );
}

export default ItemProject;
