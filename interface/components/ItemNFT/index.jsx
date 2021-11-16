import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
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
  }, [account, txnStatus]);

  const nftItemClassName = {
    0: "item-nft-0",
    1: "item-nft-1"
  }

  function visible(nftSymbol) {
    let visibility = "hidden";
    if (nftSymbol == borrowProject) {
      visibility = "";
    }
    return visibility
  } 

  const handleChange = (tokenId) => {
    if (tokenId == borrowNFT) {
      setBorrowNFT("--");
    } else {
      setBorrowNFT(tokenId);
    }
    console.log('setting borrowNFT to', tokenId);
  }

  return (
    <div>
    <div className={visible("PUNK")}>
      {Object.keys(imageDictPUNK).map(tokenId => (
        <div className={nftItemClassName[tokenId]} key={tokenId}>
          <input type="checkbox" onChange={() => handleChange(tokenId)} className="rectangle-33 border-1px-pickled-bluewood"></input>
          <img className="rectangle-32" src={imageDictPUNK[tokenId]} />
          <div className="fidenza-157-3 valign-text-middle oxanium-normal-black-20px">PUNK<br></br>#{tokenId}</div> 
        </div>   
      ))}
    </div>
    <div className={visible("BAYC")}>
      {Object.keys(imageDictBAYC).map(tokenId => (
        <div className={nftItemClassName[tokenId]} key={tokenId}>
          <input type="checkbox" onChange={() => handleChange(tokenId)} className="rectangle-33 border-1px-pickled-bluewood"></input>
          <img className="rectangle-32" src={imageDictBAYC[tokenId]} />
          <div className="fidenza-157-3 valign-text-middle oxanium-normal-black-20px">BAYC<br></br>#{tokenId}</div> 
        </div>   
      ))}
    </div>
    </div>
  );
}

export default ItemNFT;
