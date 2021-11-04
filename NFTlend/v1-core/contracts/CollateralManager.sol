//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { SafeMath } from '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract CollateralManager {
    using SafeMath for uint256;

    address payable public owner;
    uint256 counter;
    
    struct Collateral {
        address erc721Token;
        uint256 tokenId;
    }

    struct Borrow {
        Collateral collateral;
        address borrower;
        address erc20Token;
        uint256 repaymentAmount;
        uint256 liquidationPrice;
        uint256 maturity;
    }

    mapping(uint256 => Borrow) public borrows;
    mapping(address => uint256) public liquidationThresholds;

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
        counter = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'ONLY_OWNER');
        _;
    }

    function deposit(
        address borrower,
        address erc20Token,
        address erc721Token, 
        uint256 tokenId, 
        uint256 repaymentAmount,
        uint256 collateralIndexPrice,
        uint256 maturity) public payable
    {
        uint256 liquidationPrice = collateralIndexPrice.div(getLiquidationThreshold(erc721Token));
        IERC721(erc721Token).transferFrom(borrower, address(this), tokenId);
        uint256 id = counter;
        borrows[id] = Borrow({
            collateral: Collateral({
                erc721Token: erc721Token,
                tokenId: tokenId
            }),
            borrower: borrower,
            erc20Token: erc20Token,
            repaymentAmount: repaymentAmount,
            liquidationPrice: liquidationPrice,
            maturity: maturity
        });
        counter += 1;
        emit DepositCollateral(
            borrower,
            erc721Token,
            tokenId,
            id
        );
    }

    function withdraw (uint256 _id) public {
        address borrower = borrows[_id].borrower;
        address erc721Token = borrows[_id].collateral.erc721Token;
        uint256 tokenId = borrows[_id].collateral.tokenId;
        delete(borrows[_id]);
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
}