import { title } from "process";
import React from "react";
import "./Instructions.css";

function Instructions(props) {

  const { page } = props;

  // const {title, subtitle} = () => {
  //   switch(page) {
  //     case "BORROW":
  //       let _title = "Foo";
  //       let _subtitle = "BAR";
  //       return title, subtitle
  //   } 
  // }

  let title="";
  let subtitle="";

  if (page == "BORROW") {
    title = "Deposit your NFTs to instantly access permissionless loans.";
    subtitle = "Note that borrows not repaid by maturity or collaterized by less than 150% may be liquidated.";
  } else if (page == "LEND") {
    title = "Deposit to earn interest on your assets. Liquidity can be removed at any time.";
    subtitle = "Note that balances and APY are updated each block based on open borrows and the token supply. "; 
  } else if (page == "LIQUIDATE") {
    title = "Liquidate defaulted borrows to purchase the underlying NFT at a discount. ";
    subtitle = "Liquidations maintain protocol health and are incentivised with prices at 10-20% below the market floor."; 
  } else if (page == "ASSET") {
    title = "Asset borrow details.";
    subtitle = "Including historic data and external links.";   
  }
      
  return (
    <div className="instructions">
      <div className="text-13 valign-text-middle oxanium-bold-web-orange-24px">
        <span>
          <span className="oxanium-bold-web-orange-24px">
            {title}
            <br />
          </span>
          <span className="oxanium-extra-light-web-orange-24px">
            {subtitle}
          </span>
        </span>
      </div>
    </div>
  );
}

export default Instructions;
