import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import AssetItem from "../AssetItem";
import ButtonRepay from "../ButtonRepay";
import TokenBorrow from "../TokenBorrow";
import "./Borrow.css";
import useCollateralManager from "../../hooks/useCollateralManager";
import { useAppContext } from "../../AppContext";
import useNFT from "../../hooks/useNFT";


function Borrow(props) {
  const {borrowId} = props;
  const { account } = useWeb3React();
  const { fetchUserBorrows } = useCollateralManager();
  const { userBorrows } = useAppContext();
  const { 
    fetchImageBAYC,
    fetchImagePUNK} = useNFT();

  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    if (account) {
      fetchUserBorrows();
      userBorrows;
      async function fetchImgUrl() {
        const nftTokenId = await userBorrows[borrowId]["nftTokenId"];
        if (userBorrows[borrowId]["nftSymbol"]=="BAYC"){
          let _imgUrl = await fetchImageBAYC(nftTokenId);
          setImgUrl(_imgUrl)
        } else {
          let _imgUrl = await fetchImagePUNK(nftTokenId);
          setImgUrl(_imgUrl)
        } 
      }
      fetchImgUrl();
    }  
  }, [account]);

  const formatDate = (timestamp) => {
    let monthNames =["Jan","Feb","Mar","Apr",
                      "May","Jun","Jul","Aug",
                      "Sep", "Oct","Nov","Dec"];
    
    let date = new Date(timestamp * 1000);
    let day = date.getDate();
    
    let monthIndex = date.getMonth();
    let monthName = monthNames[monthIndex];
    
    let year = date.getFullYear();
    
    return `${day}-${monthName}-${year}`;  
  }

  const formatCountdown = (timestamp) => {
    let countDownDate = new Date(timestamp * 1000);

    let now = new Date().getTime(); 
    let distance = countDownDate - now;
      
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  }

  return (
    <div className="borrow-6">
      <div className="overlap-group-13">
        <div className="rectangle-17"></div>
        <div className="number valign-text-middle oxanium-normal-black-24px">{Number(userBorrows[borrowId]["borrowAmount"]).toFixed(1)}</div> {/* TODO: Make number of decimals consistent  */}
        <div className="text valign-text-middle oxanium-normal-black-25px">{Number(userBorrows[borrowId]["repaymentAmount"]).toFixed(4)}</div>
        <div className="percent valign-text-middle oxanium-normal-black-25px">{Number(userBorrows[borrowId]["interestRate"]).toFixed(0)}</div>
        <AssetItem 
          nftSymbol={userBorrows[borrowId]["nftSymbol"]}
          nftTokenId={userBorrows[borrowId]["nftTokenId"]}
          imgUrl={imgUrl}
        />
        <ButtonRepay 
          borrowId={borrowId}
          repaymentAmount={userBorrows[borrowId]["repaymentAmount"]}
          nftSymbol={userBorrows[borrowId]["nftSymbol"]}
          nftTokenId={userBorrows[borrowId]["nftTokenId"]}
          imgUrl={imgUrl}
          tokenAddress={userBorrows[borrowId]["erc20Token"]}
        />
        <div className="x175-min-150 valign-text-middle oxanium-bold-black-20px">
          <span>
            <span className="oxanium-bold-black-20px">
              175%
              <br />
            </span>
            <span className="oxanium-normal-black-20px">Min. 150%</span>
          </span>
        </div>
        <div className="text-1 valign-text-middle oxanium-bold-black-20px">
          <span>
            <span className="oxanium-bold-black-20px">
            {formatDate(userBorrows[borrowId]["maturity"])}
              <br />
            </span>
            <span className="oxanium-normal-black-20px">{formatCountdown(userBorrows[borrowId]["maturity"])}</span>
          </span>
        </div>
        <TokenBorrow />
      </div>
    </div>
  );
}

export default Borrow;