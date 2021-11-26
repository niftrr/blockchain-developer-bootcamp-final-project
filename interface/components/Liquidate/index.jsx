import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Header from "../Header";
import Background from "../Background";
import LiquidateHeader from "../LiquidateHeader";
import Liquidate2 from "../Liquidate2";
import Instructions from "../Instructions";
import "./Liquidate.css";
import useCollateralManager from "../../hooks/useCollateralManager";
import { useAppContext } from "../../AppContext";
import useLendingPool from "../../hooks/useLendingPool";

function Liquidate(props) {
  const { headerProps, liquidate2Props, liquidate22Props, liquidate23Props } = props;
  const { account } = useWeb3React();
  const { borrowDefaults } = useAppContext();
  const { fetchDefaultedBorrows } = useCollateralManager();
  const { assetTokenContractAddressSymbolLookup } = useLendingPool();

  useEffect(() => {
    if (account) {
      fetchDefaultedBorrows();
      console.log('liquidate');
    }  
  }, [account, borrowDefaults]);

  return (
    <div className="container-center-horizontal">
      <div className="liquidate-6 screen">
        <Header className={headerProps.className} />
        <div className="overlap-group4-1">
          <Background />
          <div className="liquidate-container">
            <LiquidateHeader />
            {Object.keys(borrowDefaults).map((key, index) => (
              <Liquidate2
                assetItemProps={liquidate2Props.assetItemProps} 
                tokenBorrowProps={liquidate2Props.tokenBorrowProps} 
                liquidationPrice={borrowDefaults[key]["liquidationPrice"]}
                maturityTimestamp={borrowDefaults[key]["maturity"]}
                collRatio={borrowDefaults[key]["collRatio"]}
                nftSymbol={borrowDefaults[key]["nftSymbol"]}
                nftTokenId={borrowDefaults[key]["nftTokenId"]}
                tokenAddress={borrowDefaults[key]["erc20Token"]}
                token={assetTokenContractAddressSymbolLookup[borrowDefaults[key]["erc20Token"]]} 
                borrowId={key}
                key={index}
              />
            ))}
          </div>
          <Instructions page="LIQUIDATE" />
        </div>
      </div>
    </div>
  );
}

export default Liquidate;
