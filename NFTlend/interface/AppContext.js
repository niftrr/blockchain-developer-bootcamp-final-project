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
    setImageDict: () => {},
    whitelistNFT: [],
    setWhitelistNFT: () => {},
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

      case "SET_WHITELIST_NFT":
        return {
          ...state,
          whitelistNFT: payload,
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
        setImageDict: (symbol, imageDict) => {
          switch(symbol) {
            case "PUNK":
              dispatch({ type: "SET_IMAGE_DICT_PUNK", payload: imageDict});
            case "BAYC":
              dispatch({ type: "SET_IMAGE_DICT_BAYC", payload: imageDict});
          };
        },
        whitelistNFT: store.whitelistNFT,
        setWhitelistNFT: (whitelist) => {
          dispatch({ type: "SET_WHITELIST_NFT", payload: whitelist});
        },
        txnStatus: store.txnStatus,
        setTxnStatus: (status) => {
          dispatch({ type: "SET_TXN_STATUS", payload: status });
        },
    };

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
