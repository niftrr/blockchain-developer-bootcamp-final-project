import React from "react";
import Header from "../Header";
import Background from "../Background";
import Lends from "../Lends";
import Instructions from "../Instructions";
import "./Lend2.css";

function Lend2(props) {
  const { headerProps, lendsProps } = props;

  return (
    <div className="container-center-horizontal">
      <div className="lend-2 screen">
        <Header className={headerProps.className} />
        <div className="overlap-group1-2">
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
