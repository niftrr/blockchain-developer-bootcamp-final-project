import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Scrollbars } from 'react-custom-scrollbars';
import useNFT from "../../hooks/useNFT";
import "./ItemNFT.css";
import { useAppContext } from "../../AppContext";
import useTransaction from "../../hooks/useTransaction";

function ItemNFT(props) {
  const { rectangle32, fidenza157 } = props;
  const { account } = useWeb3React();
  const { fetchImagesPUNK, fetchImagesBAYC,
    imageDictPUNK, imageDictBAYC, nftAddressSymbolDict } = useNFT();
  const { setBorrowNFT, borrowNFT, borrowProject } = useAppContext();
  const { txnStatus } = useTransaction();

  useEffect(() => {
    if (account) {
      fetchImagesPUNK();
      fetchImagesBAYC();
    }  
  }, [account, txnStatus, imageDictPUNK, imageDictBAYC]);

  const handleChange = (tokenId) => {
    if (tokenId == borrowNFT) {
      setBorrowNFT("--");
    } else {
      setBorrowNFT(tokenId);
    }
  }

  const checked = (tokenId) => {
    return tokenId == borrowNFT;
  }

  const imageDict = {
    "--" : {},
    "PUNK": imageDictPUNK,
    "BAYC": imageDictBAYC
  }

  return (
    <div>
      <Scrollbars style={{ width: 231, height: 250 }}>
        {Object.keys(imageDict[borrowProject]).map((tokenId, idx) => (
          <div className="item-nft" key={tokenId}>
            <input type="checkbox" onChange={() => handleChange(tokenId)} checked={checked(tokenId)} className="rectangle-33 border-1px-pickled-bluewood"></input>
            <img className="rectangle-32" src={imageDict[borrowProject][tokenId]} />
            <div className="fidenza-157-3 valign-text-middle oxanium-normal-black-20px">{borrowProject}<br></br>#{tokenId}</div> 
          </div>   
        ))}
      </Scrollbars>
    </div>
  );
}

export default ItemNFT;
