import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
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
import useImage from "../../hooks/useImage";

function Borrow2(props) {
  const {
    nftAvatar,
    amount,
    text15,
    address,
    headerProps,
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
  const { account } = useWeb3React();
  const {fetchImagesPUNK, fetchImagesBAYC, imageDictPUNK, imageDictBAYC} = useImage();

  useEffect(() => {
    if (account) {
      fetchImagesPUNK();
      fetchImagesBAYC();
    }  
  }, [account]);

  return (
    <div className="container-center-horizontal">
      <div className="borrow-7 screen">
        <Header className={headerProps.className} />
        <div className="overlap-group3">
          <Background />
          <div className="borrow-8">
            <BorrowHeader />
            <div className="flex-row">
              <div className="overlap-group1-3">
                <ItemsScroll />
                <ItemProject />
                <ItemProject className={itemProjectProps.className} />
                <ItemProject className={itemProject2Props.className} />
              </div>
              <div className="overlap-group2">
                <ItemsScroll />
                <ItemNFT rectangle32={itemNFTProps.rectangle32} fidenza157={itemNFTProps.fidenza157} />
              </div>
              <div className="borrow-body">
                <img className="nft-avatar-1" src={nftAvatar} />
                <div className="flex-col-12">
                  <div className="flex-row-1">
                    <div className="flex-col-13">
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
                  <div className="overlap-group-17">
                    <BorrowDataCollRatio maturity={borrowDataCollRatioProps.maturity} d={borrowDataCollRatioProps.d} />
                    <BorrowDataCollRatio2
                      collateralRatio={borrowDataCollRatio2Props.collateralRatio}
                      percent={borrowDataCollRatio2Props.percent}
                    />
                    <BorrowDataCollRatio2
                      collateralRatio={borrowDataCollRatio22Props.collateralRatio}
                      percent={borrowDataCollRatio22Props.percent}
                      className={borrowDataCollRatio22Props.className}
                    />
                    <div className="borrow-data-floor-price oxanium-normal-black-20px">
                      <div className="text-15 valign-text-middle">{text15}</div>
                      <div className="address valign-text-middle">{address}</div>
                    </div>
                    <BorrowDataCollRatio
                      maturity={borrowDataCollRatio2Props2.maturity}
                      d={borrowDataCollRatio2Props2.d}
                      className={borrowDataCollRatio2Props2.className}
                    />
                    <div className="borrow-data-container"></div>
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
