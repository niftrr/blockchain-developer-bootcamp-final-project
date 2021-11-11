import React, { createContext, useReducer } from "react";
import App from "./App";

const initialContext = {
    nTokenBalanceDAI: "--",
    nTokenBalanceETH: "--",
    nTokenBalanceUSDC: "--",
    setNTokenBalance: () => {},
    nTokenYieldDAI: "--",
    nTokenYieldETH: "--",
    nTokenYieldUSDC: "--",
    setNTokenYield: () => {},
    borrows: [],
    setBorrows: () => {},
    borrowDefaults: [],
    setBorrowDefaults: () => {},
    imageDictPUNK: {},
    imageDictBAYC: {},
    imageDictBorrow: {},
    setImageDict: () => {},
    whitelistNFT: [],
    setWhitelistNFT: () => {},
    borrowProject: "--",
    setBorrowProject: () => {},
    borrowNFT: "",
    setBorrowNFT: () => {},
    borrowForm: "--",
    setBorrowForm: () => {},
    borrowFloorPrice: "--",
    setBorrowFloorPrice: () => {},
    borrowCollRatio: "--",
    setBorrowCollRatio: () => {},
    borrowAPR: "--",
    setBorrowAPR: () => {},
    borrowToken: "ETH",
    setBorrowToken: () => {},
    borrowAmount: "--",
    setBorrowAmount: () => {},
    borrowRepaymentAmount: "--",
    setBorrowRepaymentAmount: () => {},
    borrowMaturity: 1,
    setBorrowMaturity: () => {},
    aprPUNK: "--",
    setAprPUNK: () => {},
    aprBAYC: "--",
    setAprBAYC: () => {},
    txnStatus: "NOT_SUMBITTED",
    setTxnStatus: () => {}
}

const appReducer = (state, { type, payload }) => {
    switch (type) {
      case "SET_NTOKEN_BALANCE_DAI":
        return {
          ...state,
          nTokenBalanceDAI: payload,
        };

      case "SET_NTOKEN_BALANCE_ETH":
        return {
          ...state,
          nTokenBalanceETH: payload,
        };

      case "SET_NTOKEN_BALANCE_USDC":
        return {
          ...state,
          nTokenBalanceUSDC: payload,
        };

      case "SET_NTOKEN_YIELD_DAI":
        return {
          ...state,
          nTokenYieldDAI: payload,
        };

      case "SET_NTOKEN_YIELD_ETH":
        return {
          ...state,
          nTokenYieldETH: payload,
        };

      case "SET_NTOKEN_YIELD_USDC":
        return {
          ...state,
          nTokenYieldUSDC: payload,
        };

      case "SET_BORROWS":
        return {
          ...state,
          setBorrows: payload,
        };
    
      case "SET_BORROW_DEFAULTS":
            return {
              ...state,
              setBorrowDefaults: payload,
            };  

      case "SET_IMAGE_DICT_PUNK":
        return {
          ...state,
          imageDictPUNK: payload,
        };  

      case "SET_IMAGE_DICT_BAYC":
        return {
          ...state,
          imageDictBAYC: payload,
        };  

      case "SET_IMAGE_DICT_BORROW":
        return {
          ...state,
          imageDictBorrow: payload,
        };  

      case "SET_WHITELIST_NFT":
        return {
          ...state,
          whitelistNFT: payload,
        };  

      case "SET_BORROW_PROJECT":
        return {
          ...state,
          borrowProject: payload,
        }; 

      case "SET_BORROW_NFT":
        return {
          ...state,
          borrowNFT: payload,
        }; 

      case "SET_BORROW_FORM":
        return {
          ...state,
          borrowForm: payload,
        }; 

      case "SET_BORROW_FLOOR_PRICE":
        return {
          ...state,
          borrowFloorPrice: payload,
        }; 

      case "SET_BORROW_COLL_RATIO":
        return {
          ...state,
          borrowCollRatio: payload,
        }; 

      case "SET_BORROW_APR":
        return {
          ...state,
          borrowAPR: payload,
        }; 

      case "SET_BORROW_TOKEN":
        return {
          ...state,
          borrowToken: payload,
        }; 
        
      case "SET_BORROW_AMOUNT":
        return {
          ...state,
          borrowAmount: payload,
        }; 

      case "SET_BORROW_REPAYMENT_AMOUNT":
      return {
        ...state,
        borrowRepaymentAmount: payload,
      }; 

      case "SET_BORROW_MATURITY":
      return {
        ...state,
        borrowMaturity: payload,
      }; 

      case "SET_APR_PUNK":
      return {
        ...state,
        aprPUNK: payload,
      }; 

      case "SET_APR_BAYC":
      return {
        ...state,
        aprBAYC: payload,
      }; 

      case "SET_TXN_STATUS":
        return {
          ...state,
          txnStatus: payload,
        };
      default:
        return state;
    }
  };

const AppContext = createContext(initialContext);
export const useAppContext = () => React.useContext(AppContext);
export const AppContextProvider = ({ children }) => {
    const [store, dispatch] = useReducer(appReducer, initialContext);

    const contextValue = {
        nTokenBalanceDAI: store.nTokenBalanceDAI,
        nTokenBalanceETH: store.nTokenBalanceETH,
        nTokenBalanceUSDC: store.nTokenBalanceUSDC,
        setNTokenBalance: (ccy, balance) => {
          switch(ccy) {
            case "DAI":
              dispatch({ type: "SET_NTOKEN_BALANCE_DAI", payload: balance});
            case "ETH":
              dispatch({ type: "SET_NTOKEN_BALANCE_ETH", payload: balance});
            case "USDC":
              dispatch({ type: "SET_NTOKEN_BALANCE_USDC", payload: balance});
          };
        },
        nTokenYieldDAI: store.nTokenYieldDAI,
        nTokenYieldETH: store.nTokenYieldETH,
        nTokenYieldUSDC: store.nTokenYieldUSDC,
        setNTokenYield: (ccy, _yield) => {
          switch(ccy) {
            case "DAI":
              dispatch({ type: "SET_NTOKEN_YIELD_DAI", payload: _yield});
            case "ETH":
              dispatch({ type: "SET_NTOKEN_YIELD_ETH", payload: _yield});
            case "USDC":
              dispatch({ type: "SET_NTOKEN_YIELD_USDC", payload: _yield});
          };
        },
        borrows: store.borrows,
        setBorrows: (borrows) => {
          dispatch({ type: "SET_BORROWS", payload: borrows});
        },
        borrowDefaults: store.borrowDefaults,
        setBorrowDefaults: (defaults) => {
          dispatch({ type: "SET_BORROW_DEFAULTS", payload: defaults});
        },
        imageDictPUNK: store.imageDictPUNK,
        imageDictBAYC: store.imageDictBAYC,
        imageDictBorrow: store.imageDictBorrow,
        setImageDict: (symbol, imageDict) => {
          switch(symbol) {
            case "PUNK":
              dispatch({ type: "SET_IMAGE_DICT_PUNK", payload: imageDict});
            case "BAYC":
              dispatch({ type: "SET_IMAGE_DICT_BAYC", payload: imageDict});
            case "BORROW":
              dispatch({ type: "SET_IMAGE_DICT_BORROW", payload: imageDict});
          };
        },
        whitelistNFT: store.whitelistNFT,
        setWhitelistNFT: (whitelist) => {
          dispatch({ type: "SET_WHITELIST_NFT", payload: whitelist});
        },
        borrowProject: store.borrowProject,
        setBorrowProject: (projectSymbol) => {
          dispatch({ type: "SET_BORROW_PROJECT", payload: projectSymbol});
        },
        borrowNFT: store.borrowNFT,
        setBorrowNFT: (tokenId) => {
          dispatch({ type: "SET_BORROW_NFT", payload: tokenId});
        },
        borrowFloorPrice: store.borrowFloorPrice,
        setBorrowFloorPrice: (price) => {
          dispatch({ type: "SET_BORROW_FLOOR_PRICE", payload: price});
        },
        borrowCollRatio: store.borrowCollRatio,
        setBorrowCollRatio: (collRatio) => {
          dispatch({ type: "SET_BORROW_COLL_RATIO", payload: collRatio});
        },
        borrowAPR: store.borrowAPR,
        setBorrowAPR: (apr) => {
          dispatch({ type: "SET_BORROW_APR", payload: apr});
        },
        borrowToken: store.borrowToken,
        setBorrowToken: (token) => {
          dispatch({ type: "SET_BORROW_TOKEN", payload: token});
        },
        borrowAmount: store.borrowAmount,
        setBorrowAmount: (amount) => {
          dispatch({ type: "SET_BORROW_AMOUNT", payload: amount});
        },
        borrowRepaymentAmount: store.borrowRepaymentAmount,
        setBorrowRepaymentAmount: (amount) => {
          dispatch({ type: "SET_BORROW_REPAYMENT_AMOUNT", payload: amount});
        },
        borrowMaturity: store.borrowMaturity,
        setBorrowMaturity: (numWeeks) => {
          dispatch({ type: "SET_BORROW_MATURITY", payload: numWeeks});
        },
        aprPUNK: store.aprPUNK,
        setAprPUNK: (apr) => {
          dispatch({ type: "SET_APR_PUNK", payload: apr});
        },
        aprBAYC: store.aprBAYC,
        setAprBAYC: (apr) => {
          dispatch({ type: "SET_APR_BAYC", payload: apr});
        },
        txnStatus: store.txnStatus,
        setTxnStatus: (status) => {
          dispatch({ type: "SET_TXN_STATUS", payload: status });
        },
    };

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
