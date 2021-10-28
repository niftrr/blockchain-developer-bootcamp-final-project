// import Web3 from 'web3'

import Web3 from "web3";

const LPaddress = "0x06291450134Fe1d6F4c9c65c4704B68C6BDB33A5"

const ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "collateral",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "tokenId",
          "type": "uint32"
        }
      ],
      "name": "Borrow",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "collateral",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "tokenId",
          "type": "uint32"
        }
      ],
      "name": "DepositNFT",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "DepositToken",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "collateral",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "tokenId",
          "type": "uint32"
        }
      ],
      "name": "Liquidate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "collateral",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "tokenId",
          "type": "uint32"
        }
      ],
      "name": "Repay",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "collateral",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "tokenId",
          "type": "uint32"
        }
      ],
      "name": "WithdrawNFT",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "WithdrawToken",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "depositToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "withdrawToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "collateral",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "tokenId",
          "type": "uint32"
        }
      ],
      "name": "depositNFT",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "collateral",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "tokenId",
          "type": "uint32"
        }
      ],
      "name": "withdrawNFT",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "collateral",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint32",
          "name": "tokenId",
          "type": "uint32"
        }
      ],
      "name": "borrow",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "asset",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "collateral",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint32",
          "name": "tokenId",
          "type": "uint32"
        }
      ],
      "name": "repay",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "collateral",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "tokenId",
          "type": "uint32"
        }
      ],
      "name": "liquidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
]

window.addEventListener('load', function() {

if (typeof window.ethereum !== 'undefined') {
    console.log('window.ethereum is enabled')
    if (window.ethereum.isMetaMask === true) {
    console.log('MetaMask is active')
    // let mmDetected = document.getElementById('mm-detected')
    // mmDetected.innerHTML += 'MetaMask Is Available!'

    // add in web3 here
    var web3 = new Web3(window.ethereum)

    // -- get wallet address
    let walletAddress = web3.currentProvider.selectedAddress;

    // -- get eth balance
    const ethBalance = web3.eth.getBalance(walletAddress);
    
    ethBalance.then((balance) => {
        console.log(balance / 10**18, "ETH");
    });

    // -- get token balance
    const tokenAddress = "0xA9410bC038259287104091a6dafc39A6F21F6e4f"

    let erc20ABI = [
        {
          "constant": true,
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "decimals",
          "outputs": [
            {
              "name": "",
              "type": "uint8"
            }
          ],
          "payable": false,
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_owner",
              "type": "address"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "name": "balance",
              "type": "uint256"
            }
          ],
          "payable": false,
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "symbol",
          "outputs": [
            {
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "type": "function"
        }
      ];

      let contract = new web3.eth.Contract(erc20ABI,tokenAddress);
      let tokenBalance = contract.methods.balanceOf(walletAddress).call();
      let tokenSymbol = contract.methods.symbol().call();
      let tokenDecimals = contract.methods.decimals().call();

      tokenBalance.then((balance) => {
        tokenSymbol.then((symbol) => {
          tokenDecimals.then((decimals) => {
            console.log(balance / 10 ** decimals, symbol);
          });
        });
      });

      // -- call liquidityPool 


    } else {
    console.log('MetaMask is not available')
    // let mmDetected = document.getElementById('mm-detected')
    // mmDetected.innerHTML += 'MetaMask Not Available!'
    // let node = document.createTextNode('<p>MetaMask Not Available!<p>')
    // mmDetected.appendChild(node)
    }
} else {
    console.log('window.ethereum is not found')
//   let mmDetected = document.getElementById('mm-detected')
//   mmDetected.innerHTML += '<p>MetaMask Not Available!<p>'
}
})