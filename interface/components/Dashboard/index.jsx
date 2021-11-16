import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Header from "../Header";
import Background from "../Background";
import BorrowsHeader from "../BorrowsHeader";
import Borrow from "../Borrow";
import Lends from "../Lends";
import "./Dashboard.css";
import useCollateralManager from "../../hooks/useCollateralManager";
import useTransaction from "../../hooks/useTransaction";
import { useAppContext } from "../../AppContext";

function Dashboard(props) {
  const { lendsProps } = props;
  const { account } = useWeb3React();
  const { fetchUserBorrows } = useCollateralManager();
  const { userBorrows } = useAppContext();
  const { txnStatus } = useTransaction();

  useEffect(() => {
    if (account) {
      fetchUserBorrows();
      userBorrows;
      console.log('user borrows');
    }  
  }, [account, txnStatus]);

  return (
    <div className="container-center-horizontal">
      <div className="dashboard screen">
        <Header />
        <div className="overlap-group4">
          <Background />
          <div className="borrows">
            <BorrowsHeader />
            {Object.keys(userBorrows).map(borrowId => (
              <Borrow borrowId={borrowId} key={borrowId} />
            ))}
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
