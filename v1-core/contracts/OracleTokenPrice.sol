// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract OracleTokenPrice {

    AggregatorV3Interface internal priceFeedETHUSD;
    AggregatorV3Interface internal priceFeedDAIUSD;
    AggregatorV3Interface internal priceFeedUSDCUSD;
    AggregatorV3Interface internal priceFeedDAIETH;
    AggregatorV3Interface internal priceFeedUSDCETH;
    
    mapping(string => bool) internal pricePairs;
    mapping(string => uint8) internal decimals;

    /**
     * Network: Kovan
     * Aggregator: ETH/USD Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     * Aggregator: DAI/ETH Address: 0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541
     * Aggregator: DAI/USD Address: 0x777A68032a88E5A84678A77Af2CD65A7b3c0775a
     * Aggregator: USDC/Eth Address: 0x0bF499444525a23E7Bb61997539725cA2e928138
     * Aggregator: USDC/USD Address: 0x9211c6b3BF41A10F78539810Cf5c64e1BB78Ec60
     */
    constructor() {
        priceFeedETHUSD = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
        priceFeedDAIETH = AggregatorV3Interface(0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541);
        priceFeedDAIUSD = AggregatorV3Interface(0x777A68032a88E5A84678A77Af2CD65A7b3c0775a);
        priceFeedUSDCETH = AggregatorV3Interface(0x0bF499444525a23E7Bb61997539725cA2e928138);
        priceFeedUSDCUSD = AggregatorV3Interface(0x9211c6b3BF41A10F78539810Cf5c64e1BB78Ec60);
        pricePairs["ETHUSD"] = true;
        pricePairs["DAIETH"] = true;
        pricePairs["DAIUSD"] = true;
        pricePairs["USDCETH"] = true;
        pricePairs["USDCUSD"] = true;
        decimals["ETHUSD"] = 8;
        decimals["DAIETH"] = 18;
        decimals["DAIUSD"] = 8;
        decimals["USDCETH"] = 18;
        decimals["USDCUSD"] = 8;
    }

    /**
     * Returns mock of the latest price with the number of decimal places
     */
    function getLatestPriceMock(string memory pricePair) public view returns (int, uint8) {
        int price;
        uint8 decimal;
        if (keccak256(abi.encodePacked(pricePair))==keccak256(abi.encodePacked("ETHUSD"))) {
            price = 400000000000;    
            decimal = decimals["ETHUSD"];
        } else if (keccak256(abi.encodePacked(pricePair))==keccak256(abi.encodePacked("DAIUSD"))) {
            price = 111000000;   
            decimal = decimals["DAIUSD"];
        } else if (keccak256(abi.encodePacked(pricePair))==keccak256(abi.encodePacked("USDCUSD"))) {
            price = 112000000;   
            decimal = decimals["USDCUSD"];
        } else if (keccak256(abi.encodePacked(pricePair))==keccak256(abi.encodePacked("DAIETH"))) {
            price = 2500000000000000;   
            decimal = decimals["DAIETH"];
        } else if (keccak256(abi.encodePacked(pricePair))==keccak256(abi.encodePacked("USDCETH"))) {
            price = 2500000000000000;   
            decimal = decimals["USDCETH"];
        }
        return (price, decimal);
    }

    /**
     * Returns the latest price with the number of decimal places
     */
    function getLatestPrice(string memory pricePair) public view returns (int, uint8) {
        require(pricePairs[pricePair], "Unexpected pricePair");
        int price;
        uint8 decimal;
        if (keccak256(abi.encodePacked(pricePair))==keccak256(abi.encodePacked("ETHUSD"))) {
            (,price,,,) = priceFeedETHUSD.latestRoundData();    
            decimal = decimals["ETHUSD"];
        } else if (keccak256(abi.encodePacked(pricePair))==keccak256(abi.encodePacked("DAIUSD"))) {
            (,price,,,) = priceFeedDAIUSD.latestRoundData(); 
            decimal = decimals["DAIUSD"];
        } else if (keccak256(abi.encodePacked(pricePair))==keccak256(abi.encodePacked("USDCUSD"))) {
            (,price,,,) = priceFeedUSDCUSD.latestRoundData(); 
            decimal = decimals["USDCUSD"];
        } else if (keccak256(abi.encodePacked(pricePair))==keccak256(abi.encodePacked("DAIETH"))) {
            (,price,,,) = priceFeedDAIETH.latestRoundData(); 
            decimal = decimals["DAIETH"];
        } else if (keccak256(abi.encodePacked(pricePair))==keccak256(abi.encodePacked("USDCETH"))) {
            (,price,,,) = priceFeedUSDCETH.latestRoundData(); 
            decimal = decimals["USDCETH"];
        }
        return (price, decimal);
    }
}