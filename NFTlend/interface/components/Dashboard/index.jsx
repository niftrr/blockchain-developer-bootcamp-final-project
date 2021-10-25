import React from "react";
import Header from "../Header";
import Background from "../Background";
import BorrowsHeader from "../BorrowsHeader";
import Borrow from "../Borrow";
import Lends from "../Lends";
import "./Dashboard.css";

function Dashboard(props) {
  const { headerProps, borrowProps, borrow2Props, borrow3Props, lendsProps } = props;

  return (
    <div className="container-center-horizontal">
      <div className="dashboard-6 screen">
        <Header className={headerProps.className} />
        <div className="overlap-group3">
          <Background />
          <div className="borrows">
            <BorrowsHeader />
            <Borrow
              buttonBorrowProps={borrowProps.buttonBorrowProps}
              buttonRepayProps={borrowProps.buttonRepayProps}
              tokenBorrowProps={borrowProps.tokenBorrowProps}
            />
            <Borrow
              buttonBorrowProps={borrow2Props.buttonBorrowProps}
              buttonRepayProps={borrow2Props.buttonRepayProps}
              tokenBorrowProps={borrow2Props.tokenBorrowProps}
            />
            <Borrow
              buttonBorrowProps={borrow3Props.buttonBorrowProps}
              buttonRepayProps={borrow3Props.buttonRepayProps}
              tokenBorrowProps={borrow3Props.tokenBorrowProps}
            />
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
