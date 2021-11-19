// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import { SafeMath } from '@openzeppelin/contracts/utils/math/SafeMath.sol';

import "hardhat/console.sol";

/// @title A contract for managing borrows and their underlying collateral
/// @author Niftrr
/// @notice Allows for the deposit/withdraw of collateral to open/close a borrow position
/// @dev Currently in development
contract CollateralManager is IERC721Receiver, AccessControl {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    bytes32 public constant CONFIGURATOR_ROLE = keccak256("CONFIGURATOR_ROLE");
    bytes32 public constant LENDING_POOL_ROLE = keccak256("LENDING_POOL_ROLE");

    address[] public whitelist;
    
    Counters.Counter private counter;

    enum State { 
        Active,
        Repaid,
        Liquidated
    }
    
    struct Collateral {
        address erc721Token;
        uint256 tokenId;
    }

    struct Borrow {
        State state;
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
    mapping(address => bool) private whitelisted;
    
    /// @notice Emitted when collateral is deposited to open a Borrow position.
    /// @param borrower The borrower account.
    /// @param erc721Token The ERC721 token for the NFT project.
    /// @param tokenId The unique identifier for the NFT project item.
    /// @param id The unique identifier for the Borrow.
    event DepositCollateral(
        address borrower,
        address erc721Token, 
        uint256 tokenId, 
        uint256 id
    );

    /// @notice Emitted when collateral is withdrawn to close a Borrow position.
    /// @param borrower The borrower account.
    /// @param erc721Token The ERC721 token for the NFT project.
    /// @param tokenId The unique identifier for the NFT project item.
    /// @param id The unique identifier for the Borrow.
    event WithdrawCollateral(
        address borrower,
        address erc721Token, 
        uint256 tokenId, 
        uint256 id
    );

    constructor(address configurator, address lendingPool) {
        // Grant the configurator and lendingPool roles
        _setupRole(CONFIGURATOR_ROLE, configurator);
        _setupRole(LENDING_POOL_ROLE, lendingPool);
    }

    modifier onlyConfigurator() {
        require(hasRole(CONFIGURATOR_ROLE, msg.sender), "Caller is not the Configurator");
        _;
    }

    modifier onlyLendingPool() {
        require(hasRole(LENDING_POOL_ROLE, msg.sender), "Caller is not the Lending Pool");
        _;
    }

    /// @notice To deposit an ERC721 token in escrow and create a borrow position.
    /// @param borrower The borrower account.
    /// @param erc20Token The ERC20 token to be borrowed.
    /// @param erc721Token The ERC721 token to be used as collateral.
    /// @param tokenId The tokenId of the ERC721 token to be deposited.
    /// @param borrowAmount The amount of ERC20 tokens to be borrowed.
    /// @param repaymentAmount The amount of ERC20 tokens to be repaid. 
    /// @param interestRate The interest rate APR on the borrowed amount to 18 decimals.
    /// @param collateralFloorPrice The current floor price of the ERC721 token.
    /// @param maturity The borrow maturity timestamp.
    /// @dev Transfers the ERC721 to this contract address for escrow and creates a borrow. 
    /// @return Returns true if succeeded.
    function deposit(
        address borrower,
        address erc20Token,
        address erc721Token, 
        uint256 tokenId, 
        uint256 borrowAmount,
        uint256 repaymentAmount,
        uint256 interestRate,
        uint256 collateralFloorPrice,
        uint256 maturity
    ) 
        external
        payable 
        onlyLendingPool
        returns (bool)
    {
        require(whitelisted[erc721Token], "NFT not whitelisted");
        IERC721(erc721Token).transferFrom(borrower, address(this), tokenId);

        uint256 id = counter.current();
        uint256 liquidationPrice = collateralFloorPrice.div(getLiquidationThreshold(erc721Token));

        borrows[id] = Borrow({
            state: State.Active,
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

    /// @notice To withdraw an ERC721 token from escrow and removes a borrow position.
    /// @param _id The borrower id.
    /// @param _asset The ERC20 token to be repaid.
    /// @param _repaymentAmount The amount of ERC20 tokens to be repaid. 
    /// @dev Removes a borrow and transfers the ERC721 from escrow back to the borrower. 
    function withdraw(uint256 _id, address _asset, uint256 _repaymentAmount) external onlyLendingPool {
        address borrowAsset = borrows[_id].erc20Token;
        uint256 borrowRepaymentAmount = borrows[_id].repaymentAmount;
        require(borrowAsset == _asset, "Repayment asset doesn't match borrow");
        require(borrowRepaymentAmount == _repaymentAmount, "Repayment amount doesn't match borrow");

        address borrower = borrows[_id].borrower;
        address erc721Token = borrows[_id].collateral.erc721Token;
        uint256 tokenId = borrows[_id].collateral.tokenId;
        IERC721(erc721Token).transferFrom(address(this), borrower, tokenId);

        borrows[_id].state = State.Repaid;
        
        emit WithdrawCollateral(
            borrower,
            erc721Token,
            tokenId,
            _id
        );
    }

    /// @notice Sets the interest rate APY for a given ERC721 token.
    /// @param erc721Token The ERC721 token for which to set the interest rate.
    /// @param interestRate The (new) interest rate APY to set for the project.
    /// @dev Mapping used to keep track of interest rates, set per NFT project.
    function setInterestRate(address erc721Token, uint256 interestRate) external onlyConfigurator {
        interestRates[erc721Token] = interestRate;
    }

    /// @notice Sets the liquidation threshold for a given ERC721 token.
    /// @param _erc721Token The ERC721 token.
    /// @param _threshold The minimum collateralization theshold as an 18 decimal percentage.
    /// @dev Mapping used to keep track of liquidation thresholds, set per NFT project.
    function setLiquidationThreshold(address _erc721Token, uint256 _threshold) external onlyConfigurator {
        liquidationThresholds[_erc721Token] = _threshold;
    }

    /// @notice Updates the NFT project whitelist with a given ERC721 token.
    /// @param erc721Token The ERC721 token.
    /// @param isWhitelisted The boolean for whether to set as whitelisted.
    /// @dev Both the whitelisted mapping a whitelist array are updated.
    function updateWhitelist(address erc721Token, bool isWhitelisted) external onlyConfigurator {
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

    /// @notice For the receiving of ERC721 tokens to this contract address.
    /// @dev An ERC721 `safeTransferFrom` will revert unless this Solidity selector is returned.
    /// @return Always returns `IERC721Receiver.onERC721Received.selector`.
    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    /// @notice Gets a list of borrow ids for a given user account.
    /// @param user The user account.
    /// @dev Uses a mapping.
    /// @return Returns an array of the user borrow ids.
    function getUserBorrows(address user) public view returns (uint256[] memory) {
        return userBorrows[user];
    }

    /// @notice Retreives the Borrow for a given id.
    /// @dev Uses a mapping and returns a struct.
    /// @return Returns the Borrow for a given id.
    function getBorrow(uint256 borrowId) public view returns (Borrow memory) {
        return borrows[borrowId];
    }

    /// @notice Gets the interest rate APY for a given ERC721 token.
    /// @param erc721Token The ERC721 token for which to get the interest rate.
    /// @dev Retrieves the NFT project interest rate back from the mapping.
    /// @return Interest rate APR to 18 decimal places.
    function getInterestRate(address erc721Token) public view returns (uint256) {
        return interestRates[erc721Token];
    }

    /// @notice Gets the liquidation threshold for a given ERC721 token.
    /// @param _erc721Token The ERC721 token.
    /// @dev Retrieves the NFT project liquidation threshold from the mapping.
    /// @return Returns the liquidation threshold as an 18 decimal percentage.
    function getLiquidationThreshold(address _erc721Token) public view returns (uint256) {
        return liquidationThresholds[_erc721Token];
    }

    /// @notice Retrieves an array of whitelisted NFT projects.
    /// @dev Returns a dynamic array.
    /// @return The NFT project whitelist as an array.
    function getWhitelist() public view returns (address[] memory) {
        return whitelist;
    }
}