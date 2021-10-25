import React from "react";
import Header from "../Header";
import Background from "../Background";
import Lends from "../Lends";
import Instructions from "../Instructions";
import "./Lend2.css";

function Lend2(props) {
  const { lendsProps } = props;

  return (
    <div className="container-center-horizontal">
      <div className="lend-2 screen">
        <Header />
        <div className="overlap-group1-4">
          <Background />
          <Lends
            className={lendsProps.className}
            lendProps={lendsProps.lendProps}
            lend2Props={lendsProps.lend2Props}
            lend3Props={lendsProps.lend3Props}
          />
          <Instructions />
        </div>
      </div>
    </div>
  );
}

export default Lend2;
