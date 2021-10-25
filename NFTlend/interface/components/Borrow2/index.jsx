import React from "react";
import Header from "../Header";
import Background from "../Background";
import BorrowHeader from "../BorrowHeader";
import ItemsScroll from "../ItemsScroll";
import ItemProject from "../ItemProject";
import ItemNFT from "../ItemNFT";
import BorrowToken from "../BorrowToken";
import InputText from "../InputText";
import ButtonBorrow from "../ButtonBorrow";
import BorrowDataCollRatio from "../BorrowDataCollRatio";
import BorrowDataCollRatio2 from "../BorrowDataCollRatio2";
import Instructions from "../Instructions";
import "./Borrow2.css";

function Borrow2(props) {
  const {
    nftAvatar,
    amount,
    text16,
    address,
    itemProjectProps,
    itemProject2Props,
    itemNFTProps,
    borrowTokenProps,
    inputTextProps,
    borrowToken2Props,
    buttonBorrowProps,
    borrowDataCollRatioProps,
    borrowDataCollRatio2Props,
    borrowDataCollRatio22Props,
    borrowDataCollRatio2Props2,
  } = props;

  return (
    <div className="container-center-horizontal">
      <div className="borrow-9 screen">
        <Header />
        <div className="overlap-group3-1">
          <Background />
          <div className="borrow-10">
            <BorrowHeader />
            <div className="flex-row">
              <div className="overlap-group1-3">
                <ItemsScroll />
                <ItemProject />
                <ItemProject className={itemProjectProps.className} />
                <ItemProject className={itemProject2Props.className} />
              </div>
              <div className="overlap-group2-1">
                <ItemsScroll />
                <ItemNFT rectangle32={itemNFTProps.rectangle32} fidenza157={itemNFTProps.fidenza157} />
              </div>
              <div className="borrow-body">
                <img className="nft-avatar-1" src={nftAvatar} />
                <div className="flex-col-11">
                  <div className="flex-row-1">
                    <div className="flex-col-12">
                      <BorrowToken
                        token={borrowTokenProps.token}
                        inputDropdownProps={borrowTokenProps.inputDropdownProps}
                      />
                      <div className="borrow-amount">
                        <div className="amount valign-text-middle oxanium-normal-black-20px">{amount}</div>
                        <InputText>{inputTextProps.children}</InputText>
                      </div>
                      <BorrowToken
                        token={borrowToken2Props.token}
                        className={borrowToken2Props.className}
                        inputDropdownProps={borrowToken2Props.inputDropdownProps}
                      />
                    </div>
                    <ButtonBorrow className={buttonBorrowProps.className}>{buttonBorrowProps.children}</ButtonBorrow>
                  </div>
                  <div className="overlap-group-14">
                    <BorrowDataCollRatio
                      maturity={borrowDataCollRatioProps.maturity}
                      d={borrowDataCollRatioProps.d}
                      className={borrowDataCollRatioProps.className}
                    />
                    <BorrowDataCollRatio2
                      collateralRatio={borrowDataCollRatio2Props.collateralRatio}
                      percent={borrowDataCollRatio2Props.percent}
                      className={borrowDataCollRatio2Props.className}
                    />
                    <BorrowDataCollRatio2
                      collateralRatio={borrowDataCollRatio22Props.collateralRatio}
                      percent={borrowDataCollRatio22Props.percent}
                      className={borrowDataCollRatio22Props.className}
                    />
                    <div className="borrow-data-floor-price-1 oxanium-normal-black-20px">
                      <div className="text-16 valign-text-middle">{text16}</div>
                      <div className="address valign-text-middle">{address}</div>
                    </div>
                    <BorrowDataCollRatio
                      maturity={borrowDataCollRatio2Props2.maturity}
                      d={borrowDataCollRatio2Props2.d}
                      className={borrowDataCollRatio2Props2.className}
                    />
                    <div className="borrow-data-container-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Instructions />
        </div>
      </div>
    </div>
  );
}

export default Borrow2;
