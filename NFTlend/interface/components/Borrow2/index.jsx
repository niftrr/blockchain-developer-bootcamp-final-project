import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Header from "../Header";
import Background from "../Background";
import BorrowHeader from "../BorrowHeader";
import ItemsScroll from "../ItemsScroll";
import ItemProject from "../ItemProject";
import ItemNFT from "../ItemNFT";
import BorrowMaturity from "../BorrowMaturity";
import BorrowToken from "../BorrowToken";
import InputText from "../InputText";
import ButtonBorrow from "../ButtonBorrow";
import BorrowDataCollRatio from "../BorrowDataCollRatio";
import BorrowDataCollRatio1 from "../BorrowDataCollRatio1";
import BorrowDataCollRatio2 from "../BorrowDataCollRatio2";
import BorrowDataCollateral from "../BorrowDataCollateral";
import BorrowDataRepaymentAmount from "../BorrowDataRepaymentAmount";
import Instructions from "../Instructions";
import "./Borrow2.css";
import useNFT from "../../hooks/useNFT";
import useCollateralManager from "../../hooks/useCollateralManager";
import useLendingPool from "../../hooks/useLendingPool";
import { useAppContext } from "../../AppContext";



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
  const { fetchImagesPUNK, fetchImagesBAYC, fetchImagesBorrow,
    imageDictPUNK, imageDictBAYC, nftAddressSymbolDict } = useNFT();
  const { fetchWhitelistNFT, whitelistNFT } = useCollateralManager();
  const { fetchBorrowFloorPrice, borrowFloorPrice } = useLendingPool();
  const { borrowNFT, borrowProject, imageDictBorrow } = useAppContext();

  useEffect(() => {
    if (account) {
      fetchImagesPUNK();
      fetchImagesBAYC();
      fetchImagesBorrow();
      fetchWhitelistNFT();
      fetchBorrowFloorPrice();
    }  
  }, [account]);

  const nftProjectClassName = {
    "PUNK": itemProject2Props.className,
    "BAYC": "",
    "Fidenza": itemProject2Props.className
  }

  function visible(nftSymbol) {
    let visibility = "nft-avatar-1-hidden";
    if (nftSymbol == borrowProject) {
      visibility = "nft-avatar-1";
    }
    return visibility
  } 

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
                {whitelistNFT.map(nft => (
                  <ItemProject className={nftProjectClassName[nftAddressSymbolDict[nft]]} nftSymbol={nftAddressSymbolDict[nft]} key={nft}/>
                ))}
              </div>
              <div className="overlap-group2">
                <ItemsScroll />
                <ItemNFT rectangle32={itemNFTProps.rectangle32} fidenza157={itemNFTProps.fidenza157} />
              </div>
              <div className="borrow-body">
                <div className="nft-avatar-container">
                <img className={visible("PUNK")} src={imageDictPUNK[borrowNFT]}/>
                <img className={visible("BAYC")} src={imageDictBAYC[borrowNFT]} />
                </div>
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
                      <BorrowMaturity
                        token={borrowToken2Props.token}
                        className={borrowToken2Props.className}
                        inputDropdownProps={borrowToken2Props.inputDropdownProps}
                      />
                    </div>
                    <ButtonBorrow className={buttonBorrowProps.className}>{buttonBorrowProps.children}</ButtonBorrow>
                  </div>
                  <div className="overlap-group-17">
                    <BorrowDataRepaymentAmount maturity={borrowDataCollRatioProps.maturity} />
                    <BorrowDataCollRatio2
                      collateralRatio={borrowDataCollRatio2Props.collateralRatio}
                      percent={borrowDataCollRatio2Props.percent}
                    />
                    <BorrowDataCollRatio1
                      collateralRatio={borrowDataCollRatio22Props.collateralRatio}
                      className={borrowDataCollRatio22Props.className}
                    />
                    <div className="borrow-data-floor-price oxanium-normal-black-20px">
                      <div className="text-15 valign-text-middle">{text15}</div>
                      <div className="address valign-text-middle">{borrowFloorPrice}</div>
                    </div>
                    <BorrowDataCollateral
                      maturity={borrowDataCollRatio2Props2.maturity}
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
