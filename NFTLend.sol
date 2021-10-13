// SPDX-License-Identifier: busl-1.1
pragma solidity >=0.5.16 <0.9.0;

contract NFTLend {

    /* State variables
     */
    
    // Value Variables
    address public owner;

    address public liquidityPoolDAI;

    address public liquidityPoolWETH;

    uint public skuCount;

    uint24 public loanFee;

    uint24 public loanDefaultFee;

    // Arrays
    address[] public whitelistedNFTs;

    //address[] public whitelistedTokens; 
    
    // Mappings
    mapping(address => Balance) public balances;

    mapping(uint => Liquidity) public liquidity;

    mapping(address => Loan) public loans;

    // Enums
    enum AssetState {
        Listed,
        InEscrow,
        Unlisted
    }

    enum LoanState {
        Requested,
        Open,
        Matured,
        Repaid,
        InDefault
    }

    // Structs
    struct Asset {
        address nft;
        uint tokenId; 
        AssetState state;
    }

    struct AvailableBalance {
        uint allocated;
        uint available;
        uint committed;
    }

    struct AvailableLiquidity {
        uint allocated;
        uint available;
    }

    struct Balance {
        AvailableBalance dai;
        AvailableBalance weth;
    }

    struct Liquidity {
        AvailableLiquidity dai;
        AvailableLiquidity weth;
    }

    struct Loan {
        uint sku;
        uint maturity;
        uint loanAmount;
        uint repaymentAmount;
        uint liquidationPrice;
        //uint collateralizationRatio;
        uint partialRepaymentAmount;
        bool inDefault;
        Asset asset;
        LoanState state;
        address token;
        address payable borrower;
        address payable lender; // Update to enable multiple lenders for a single loan. How to track repayment?
    }
      
    /* Events 
     */

    // State Changes
    event LogAssetListed(address nft, uint tokenId);
    event LogAssetInEscrow(address nft, uint tokenId);
    event LogAssetUnlisted(address nft, uint tokenId);

    event LogLoanRequested(uint sku);
    event LogLoanOpen(uint sku);
    event LogLoanMatured(uint sku);
    event LogLoanRepaid(uint sku);
    event LogLoanInDefault(uint sku);

    event LogReceived(address sender, uint amount);

    /* Modifiers
     */

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier verifyCaller(address _address) {
        require(msg.sender == _address);
        _;
    }

    modifier isLiquidity(address _token, uint _amount, uint _duration) {
        // Passes if there is liquidity available for
        // the given token, amount and duration from now
        _;
    }

    modifier isRequested(address _token, uint _amount, uint _duration) {
        // Passes if there is a loan of status Requested
        // that matches the terms of the lender's provided liquidity
        _;
    }

    /* Constructor
     */

    constructor() {
        owner = msg.sender;
        skuCount = 0;
    }

    /* Fallback / Receive Functions
     */

    fallback() external payable {
        require(msg.data.length == 0);
        emit LogReceived({sender: msg.sender, amount: msg.value});
    }

    receive() external payable {
        emit LogReceived({sender: msg.sender, amount: msg.value});
    }

    /* External Functions
     */

    function addLiquidity(address _token, uint _amount, uint _duration) external  returns(bool) {
        // Lender provides liquidity, selecting:
        // - the token they wish to provide liquidity in
        // - the max amount of said token to provide
        // - when, from now, liquidity + profits should be returned 
        // Update to include approvedNFTs; to only provide liquidity to a subset of those whitelisted, passed through the front end
    }

    function removeLiquidity() external returns(bool) {
        // Lender removes liquidity
        // update liquidity variable
        // update lender balance
    }

    function requestLoan(address _nft, uint tokenId, address _token, uint _duration) external returns(bool){
        if (openLoan(_nft, tokenId, _token, _duration)) {
            return true;
        } else {
            // Handle the usecase where there is insufficient liquidity
            // Borrower pre-approves the transaction particulars matching the openLoan function
            return true;
        }
    }

    function approveLoan() external {
        // Handle the usecase where there is an open request for a loan
        // Loan is approved when new liquidity is added matching the requested Loan terms
        // Trigger?
    }

    function repayLoan(uint sku) external returns(bool) {
        // Borrower repays loan, specifying the loan sku
        // 1. fetchLoan to get details
        // 2. transfer / credit lender's balance with the repaymentAmount via receiveRepayment()
        // 3. returnCollateral()
        // 4. set state of loan to Repaid
        // 5. emit Log
    }

    function partialLoanRepayment(uint sku, address _token, uint _amount) external {
        // Borrower partially repays loan, updates Loan:
        // - partialRepaymentAmount,
        // - liquidationPrice.
        // Updates liquidity variable as transfers tokenAmount back to the liquidity pool

    }

    function withdrawToken(address token, uint amount) external returns(bool) {
        // withdraws token funds from the sender's (lender's) account balance to their wallet
    }

    function addWhitelistedNFT(address nft) isOwner external {
        // modifier to be added: must be in NFTX whitelist
        // (with sufficient liquidity at time of creation)
        whitelistedNFTs.push(nft);
    }

    function removeWhitelistedNFT(address nft) isOwner external {
        // removes NFT contract from whitelist
    }

    /* Public Functions
     */

    function ethPriceNFT(address _nft) public view returns (uint price) {
        // returns the ETH NFT floor price from NFTX
    }

    function tokenPriceNFT(address _nft, address _token) public view returns (uint price) {
        // ethPrice = ethPrice(_nft)
        // return ethPrice if _token == wEth else
        // returns the NFT's NFTX floor price token value
    }

    /* Internal Functions
     */

    function updateLiquidity() internal {
        // updates the liquidity mapping - 
        // (uint liquidity provision maturity (block/timestamp) => sum of liquidity up to maturity)
        // removes old key,value pairs 
        // maintaining data in a sparse hashtable
    }
    
    function provideLiquidity(address _token, uint _amount, uint _duration) 
        internal isRequested(_token, _amount, _duration)  returns(bool) {
        // Provide liquidity to a specific loan
    }

    function openLoan(address _nft, uint tokenId, address _token, uint _duration) 
        internal isLiquidity(_token, tokenPriceNFT(_nft, _token), _duration) returns(bool) {
        // Borrower opens loan, selecting:
        // - which NFT to deposit as collateral
        // - which ERC-20 token to receive the loan in (e.g. wETH)
        // - the duration of the loan
        // - the collateralization ratio (min. 150%)
    }

    function fetchLoan() internal {
        // fetches loan data for use internally
    }

    /* Private Functions
     */

    function depositCollateral() private {
        // takes the borrower's NFT as collateral 
        // and holds it in Escrow
    }

    function receiveLiquidity() private {
        // grants the borrower liquidity within the terms of the loan
    }

    function receiveRepayment() private {
        // pays the lender the loan repaymentAmount
    }

    function returnCollateral() private {
        // removes NFT from Escrow and returns it to the borrower
    }

    function liquidateCollateral() private {
        // deposits NFT in NFTX
    }

    function defaultLoan() private {
        // loan default if loan maturity is exceeded or loan is undercollaterlized
        // call defaultLoanRepayment()
        // call defaultLoanReturnCollateral()
        // trigger?
    }

    function defaultLoanRepayment() private {
        // swaps NFTX NFT ERC20 tokens for liquidity token - 
        // enough to pay the lender repaymentAmount
        // plus a default fee to the protocol
    }

    function defaultLoanReturnCollateral() private {
        // transfers borrower the remaining NFTX NFT ERC20 tokens
    }

}