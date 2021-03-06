import React, { createContext, useReducer } from "react";

const initialContext = {
    assetTokenBalanceDAI: "--",
    setAssetTokenBalanceDAI: () => {},
    assetTokenBalanceWETH: "--",
    setAssetTokenBalanceWETH: () => {},
    assetTokenBalanceUSDC: "--",
    setAssetTokenBalanceUSDC: () => {},
    debtTokenBalanceDAI: "--",
    setDebtTokenBalanceDAI: () => {},
    debtTokenBalanceWETH: "--",
    setDebtTokenBalanceWETH: () => {},
    debtTokenBalanceUSDC: "--",
    setDebtTokenBalanceUSDC: () => {},
    nTokenBalanceDAI: "--",
    setNTokenBalanceDAI: () => {},
    nTokenBalanceWETH: "--",
    setNTokenBalanceWETH: () => {},
    nTokenBalanceUSDC: "--",
    setNTokenBalanceUSDC: () => {},
    nTokenYieldDAI: "--",
    setNTokenYieldDAI: () => {},
    nTokenYieldWETH: "--",
    setNTokenYieldWETH: () => {},
    nTokenYieldUSDC: "--",
    setNTokenYieldUSDC: () => {},
    nTokenSupplyDAI: "--",
    setNTokenSupplyDAI: () => {},
    nTokenSupplyWETH: "--",
    setNTokenSupplyWETH: () => {},
    nTokenSupplyUSDC: "--",
    setNTokenSupplyUSDC: () => {},
    userBorrows: {},
    setUserBorrows: () => {},
    borrowDefaults: [],
    setBorrowDefaults: () => {},
    imageDictPUNK: {},
    setImageDictPUNK: () => {},
    imageDictBAYC: {},
    setImageDictBAYC: () => {},
    imageDictBorrow: {},
    setImageDictBorrow: () => {},
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
    borrowToken: "WETH",
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
      case "SET_ASSETTOKEN_BALANCE_DAI":
        return {
          ...state,
          assetTokenBalanceDAI: payload,
        };

      case "SET_ASSETTOKEN_BALANCE_WETH":
        return {
          ...state,
          assetTokenBalanceWETH: payload,
        };

      case "SET_ASSETTOKEN_BALANCE_USDC":
        return {
          ...state,
          assetTokenBalanceUSDC: payload,
        };

      case "SET_DEBTTOKEN_BALANCE_DAI":
        return {
          ...state,
          debtTokenBalanceDAI: payload,
        };

      case "SET_DEBTTOKEN_BALANCE_WETH":
        return {
          ...state,
          debtTokenBalanceWETH: payload,
        };

      case "SET_DEBTTOKEN_BALANCE_USDC":
        return {
          ...state,
          debtTokenBalanceUSDC: payload,
        };

      case "SET_NTOKEN_BALANCE_DAI":
        return {
          ...state,
          nTokenBalanceDAI: payload,
        };

      case "SET_NTOKEN_BALANCE_WETH":
        return {
          ...state,
          nTokenBalanceWETH: payload,
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

      case "SET_NTOKEN_YIELD_WETH":
        return {
          ...state,
          nTokenYieldWETH: payload,
        };

      case "SET_NTOKEN_YIELD_USDC":
        return {
          ...state,
          nTokenYieldUSDC: payload,
        };

        case "SET_NTOKEN_SUPPLY_DAI":
          return {
            ...state,
            nTokenSupplyDAI: payload,
          };
  
        case "SET_NTOKEN_SUPPLY_WETH":
          return {
            ...state,
            nTokenSupplyWETH: payload,
          };
  
        case "SET_NTOKEN_SUPPLY_USDC":
          return {
            ...state,
            nTokenSupplyUSDC: payload,
          };        

      case "SET_USER_BORROWS":
        return {
          ...state,
          userBorrows: payload,
        };
    
      case "SET_BORROW_DEFAULTS":
        return {
          ...state,
          borrowDefaults: payload,
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
      assetTokenBalanceDAI: store.assetTokenBalanceDAI,
      setAssetTokenBalanceDAI: (balance) => {
        dispatch({ type: "SET_ASSETTOKEN_BALANCE_DAI", payload: balance});
      },
      assetTokenBalanceWETH: store.assetTokenBalanceWETH,
      setAssetTokenBalanceWETH: (balance) => {
        dispatch({ type: "SET_ASSETTOKEN_BALANCE_WETH", payload: balance});
      },
      assetTokenBalanceUSDC: store.assetTokenBalanceUSDC,
      setAssetTokenBalanceUSDC: (balance) => {
        dispatch({ type: "SET_ASSETTOKEN_BALANCE_USDC", payload: balance});
      },
      debtTokenBalanceDAI: store.debtTokenBalanceDAI,
      setDebtTokenBalanceDAI: (balance) => {
        dispatch({ type: "SET_DEBTTOKEN_BALANCE_DAI", payload: balance});
      },
      debtTokenBalanceWETH: store.debtTokenBalanceWETH,
      setDebtTokenBalanceWETH: (balance) => {
        dispatch({ type: "SET_DEBTTOKEN_BALANCE_WETH", payload: balance});
      },
      debtTokenBalanceUSDC: store.debtTokenBalanceUSDC,
      setDebtTokenBalanceUSDC: (balance) => {
        dispatch({ type: "SET_DEBTTOKEN_BALANCE_USDC", payload: balance});
      },
      nTokenBalanceDAI: store.nTokenBalanceDAI,
      setNTokenBalanceDAI: (balance) => {
        dispatch({ type: "SET_NTOKEN_BALANCE_DAI", payload: balance});
      },
      nTokenBalanceWETH: store.nTokenBalanceWETH,
      setNTokenBalanceWETH: (balance) => {
        dispatch({ type: "SET_NTOKEN_BALANCE_WETH", payload: balance});
      },
      nTokenBalanceUSDC: store.nTokenBalanceUSDC,
      setNTokenBalanceUSDC: (balance) => {
        dispatch({ type: "SET_NTOKEN_BALANCE_USDC", payload: balance});
      },
      nTokenYieldDAI: store.nTokenYieldDAI,
      setNTokenYieldDAI: (_yield) => {
        dispatch({ type: "SET_NTOKEN_YIELD_DAI", payload: _yield});
      },
      nTokenYieldWETH: store.nTokenYieldWETH,
      setNTokenYieldWETH: (_yield) => {
        dispatch({ type: "SET_NTOKEN_YIELD_WETH", payload: _yield});
      },
      nTokenYieldUSDC: store.nTokenYieldUSDC,
      setNTokenYieldUSDC: (_yield) => {
        dispatch({ type: "SET_NTOKEN_YIELD_USDC", payload: _yield});
      },
      nTokenSupplyDAI: store.nTokenSupplyDAI,
      setNTokenSupplyDAI: (supply) => {
        dispatch({ type: "SET_NTOKEN_SUPPLY_DAI", payload: supply});
      },
      nTokenSupplyWETH: store.nTokenSupplyWETH,
      setNTokenSupplyWETH: (supply) => {
        dispatch({ type: "SET_NTOKEN_SUPPLY_WETH", payload: supply});
      },
      nTokenSupplyUSDC: store.nTokenSupplyUSDC,
      setNTokenSupplyUSDC: (supply) => {
        dispatch({ type: "SET_NTOKEN_SUPPLY_USDC", payload: supply});
      },
      userBorrows: store.userBorrows,
      setUserBorrows: (userBorrows) => {
        dispatch({ type: "SET_USER_BORROWS", payload: userBorrows});
      },
      borrowDefaults: store.borrowDefaults,
      setBorrowDefaults: (defaults) => {
        dispatch({ type: "SET_BORROW_DEFAULTS", payload: defaults});
      },
      imageDictPUNK: store.imageDictPUNK,
      setImageDictPUNK: (imageDict) => {
        dispatch({ type: "SET_IMAGE_DICT_PUNK", payload: imageDict});
      },
      imageDictBAYC: store.imageDictBAYC,
      setImageDictBAYC: (imageDict) => {
        dispatch({ type: "SET_IMAGE_DICT_BAYC", payload: imageDict});
      },
      imageDictBorrow: store.imageDictBorrow,
      setImageDictBorrow: (imageDict) => {
        dispatch({ type: "SET_IMAGE_DICT_BORROW", payload: imageDict});
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
