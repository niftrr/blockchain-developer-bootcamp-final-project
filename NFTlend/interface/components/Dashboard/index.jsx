import React from "react";
import Header from "../Header";
import Background from "../Background";
import BorrowsHeader from "../BorrowsHeader";
import Borrow from "../Borrow";
import Lends from "../Lends";
import "./Dashboard.css";

function Dashboard(props) {
  const { lendsProps } = props;

  return (
    <div className="container-center-horizontal">
      <div className="dashboard screen">
        <Header />
        <div className="overlap-group4">
          <Background />
          <div className="borrows">
            <BorrowsHeader />
            <Borrow />
            <Borrow />
            <Borrow />
          </div>
          <Lends
            lendProps={lendsProps.lendProps}
            lend2Props={lendsProps.lend2Props}
            lend3Props={lendsProps.lend3Props}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
