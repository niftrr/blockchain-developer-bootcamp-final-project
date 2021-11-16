// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import { SafeMath } from '@openzeppelin/contracts/utils/math/SafeMath.sol';

import "hardhat/console.sol";

contract CollateralManager is IERC721Receiver {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    address payable public owner;
    Counters.Counter private counter;
    
    struct Collateral {
        address erc721Token;
        uint256 tokenId;
    }

    struct Borrow {
        Collateral collateral;
        address borrower;
        address erc20Token;
        uint256 borrowAmount;
        uint256 repaymentAmount;
        uint256 interestRate;
        uint256 liquidationPrice;
        uint256 maturity;
    }

    mapping(uint256 => Borrow) public borrows;
    mapping(address => uint256[]) public userBorrows;
    mapping(address => uint256) public liquidationThresholds;
    mapping(address => uint256) public interestRates;
    mapping(address => bool) public whitelisted;
    address[] public whitelist;

    event DepositCollateral(
        address borrower,
        address erc721Token, 
        uint256 tokenId, 
        uint256 id
    );

    event WithdrawCollateral(
        address borrower,
        address erc721Token, 
        uint256 tokenId, 
        uint256 id
    );

    constructor() {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'ONLY_OWNER');
        _;
    }

    function setInterestRate(address erc721Token, uint256 interestRate) public onlyOwner {
        interestRates[erc721Token] = interestRate;
    }

    function getInterestRate(address erc721Token) public view returns (uint256) {
        return interestRates[erc721Token];
    }

    function updateWhitelist(address erc721Token, bool isWhitelisted) public onlyOwner {
        whitelisted[erc721Token] = isWhitelisted;
        if (isWhitelisted) {
            whitelist.push(erc721Token);
        } else {
            for (uint i = 0; i < whitelist.length-1; i++){
                if (whitelist[i] == erc721Token) {
                    whitelist[i] = whitelist[whitelist.length-1];
                    whitelist.pop();
                }
            }
        }
    }

    function getWhitelist() public view returns (address[] memory) {
        return whitelist;
    }

    /**
     * Always returns `IERC721Receiver.onERC721Received.selector`.
     */
    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function deposit(
        address borrower,
        address erc20Token,
        address erc721Token, 
        uint256 tokenId, 
        uint256 borrowAmount,
        uint256 repaymentAmount,
        uint256 interestRate,
        uint256 collateralIndexPrice,
        uint256 maturity) public payable returns (bool)
    {
        require(whitelisted[erc721Token], "NFT not whitelisted");
        IERC721(erc721Token).transferFrom(borrower, address(this), tokenId);

        uint256 id = counter.current();
        uint256 liquidationPrice = collateralIndexPrice.div(getLiquidationThreshold(erc721Token));

        borrows[id] = Borrow({
            collateral: Collateral({
                erc721Token: erc721Token,
                tokenId: tokenId
            }),
            borrower: borrower,
            erc20Token: erc20Token,
            borrowAmount: borrowAmount,
            repaymentAmount: repaymentAmount,
            interestRate: interestRate,
            liquidationPrice: liquidationPrice,
            maturity: maturity
        });

        userBorrows[borrower].push(id);
        counter.increment();

        emit DepositCollateral(
            borrower,
            erc721Token,
            tokenId,
            id
        );
        return true;
    }

    function withdraw (uint256 _id, address _asset, uint256 _repaymentAmount) public 
    {
        address borrowAsset = borrows[_id].erc20Token;
        uint256 borrowRepaymentAmount = borrows[_id].repaymentAmount;
        require(borrowAsset == _asset, "Repayment asset doesn't match borrow");
        require(borrowRepaymentAmount == _repaymentAmount, "Repayment amount doesn't match borrow");

        address borrower = borrows[_id].borrower;
        address erc721Token = borrows[_id].collateral.erc721Token;
        uint256 tokenId = borrows[_id].collateral.tokenId;
        delete(borrows[_id]);
        removeUserBorrow(borrower, _id);
        
        IERC721(erc721Token).transferFrom(address(this), borrower, tokenId);
        
        emit WithdrawCollateral(
            borrower,
            erc721Token,
            tokenId,
            _id
        );
    }

    function setLiquidationThreshold(address _erc721Token, uint256 _threshold) public onlyOwner {
        liquidationThresholds[_erc721Token] = _threshold;
    }

    function getLiquidationThreshold(address _erc721Token) public view returns (uint256) {
        return liquidationThresholds[_erc721Token];
    }

    function getUserBorrows(address user) public view returns (uint256[] memory) {
        return userBorrows[user];
    }

    function removeUserBorrow(address user, uint256 borrowId) internal {
        for (uint i = 0; i<userBorrows[user].length-1; i++){
            if (userBorrows[user][i] == borrowId) {
                userBorrows[user][i] = userBorrows[user][userBorrows[user].length-1];
                userBorrows[user].pop();
            }
        }
    }

    function getBorrow(uint256 borrowId) public view returns (Borrow memory) {
        return borrows[borrowId];
    }
}