// SPDX-License-Identifier: Unlinsenced
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IFactory {
    function getExchange(address _tokenAddress) external returns (address);
}

interface IExchange {
    function ethToTokenSwap(uint256 _minTokens) external payable;

    function ethToTokenTransfer(uint256 _minTokens, address _recipient)
        external
        payable;
}

/// @title Exchange contract actually defines exchanging logic.
/// @author stasgrate
/// @notice Each pair (eth-token) is deployed as an exchange contract and allows to exchange ether to/from only one token.
/// @dev Explain to a developer any extra details
contract Exchange is ERC20 {
    address public tokenAddress;
    address public factoryAddress;
    uint256 _fees = 1;

    event SwapTransfer(
        address from,
        address to,
        uint256 amountSold,
        uint256 amountPurchased,
        uint256 timestamp,
        string txType
    );

    constructor(address _token) ERC20("Muuswap-V1", "MUU-V1") {
        require(_token != address(0), "Invalid token address");

        tokenAddress = _token;
        factoryAddress = msg.sender;
    }

    function addLiquidity(uint256 _tokenAmount)
        public
        payable
        returns (uint256)
    {
        if (getReserve() == 0) {
            IERC20 token = IERC20(tokenAddress);
            token.transferFrom(msg.sender, address(this), _tokenAmount);

            uint256 liquidity = address(this).balance;
            _mint(msg.sender, liquidity);
            return liquidity;
        } else {
            uint256 ethReserve = address(this).balance - msg.value;
            uint256 tokenReserve = getReserve();
            uint256 tokenAmount = (msg.value * tokenReserve) / ethReserve;
            require(_tokenAmount >= tokenAmount, "insufficient token amount");

            IERC20 token = IERC20(tokenAddress);
            token.transferFrom(msg.sender, address(this), tokenAmount);

            uint256 liquidity = (totalSupply() * msg.value) / ethReserve;
            _mint(msg.sender, liquidity);

            return liquidity;
        }
    }

    function removeLiquidity(uint256 _amountToBurn)
        public
        returns (uint256, uint256)
    {
        require(_amountToBurn > 0, "invalid amount");

        uint256 ethAmount = (address(this).balance * _amountToBurn) /
            totalSupply();
        uint256 tokenAmount = (getReserve() * _amountToBurn) / totalSupply();

        _burn(msg.sender, _amountToBurn);
        payable(msg.sender).transfer(ethAmount);
        IERC20(tokenAddress).transfer(msg.sender, tokenAmount);

        return (ethAmount, tokenAmount);
    }

    /// @notice returns token balance of an exchange
    function getReserve() public view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }

    function getPrice(uint256 inputReserve, uint256 outputReserve)
        public
        pure
        returns (uint256)
    {
        require(inputReserve > 0 && outputReserve > 0, "Invalid reserves");

        return (inputReserve * 1000) / outputReserve;
    }

    function getAmount(
        uint256 inputAmount,
        uint256 inputReserve,
        uint256 outputReserve
    ) private view returns (uint256) {
        require(inputReserve > 0 && outputReserve > 0, "Invalid reserve");

        uint256 amountWithFees = inputAmount * (100 - _fees);
        return
            (amountWithFees * outputReserve) /
            (100 * inputReserve + amountWithFees);
    }

    /// @notice Explain to an end user what this does
    /// @param _ethSold is amount of ether buyer sells to purchase target token
    /// @return amount of token to be purchased
    function tokenAmountPurchased(uint256 _ethSold)
        public
        view
        returns (uint256)
    {
        require(_ethSold > 0, "ethSold is too small");

        uint256 tokenReserve = getReserve();

        return getAmount(_ethSold, address(this).balance, tokenReserve);
    }

    function ethAmountPurchased(uint256 _tokenSold)
        public
        view
        returns (uint256)
    {
        require(_tokenSold > 0, "tokenSold is too small");

        uint256 tokenReserve = getReserve();

        return getAmount(_tokenSold, tokenReserve, address(this).balance);
    }

    function ethToToken(uint256 _minTokenAmount, address _recipient) private {
        uint256 tokenReserve = getReserve();
        uint256 tokenPurchased = getAmount(
            msg.value,
            address(this).balance - msg.value,
            tokenReserve
        );
        require(
            tokenPurchased >= _minTokenAmount,
            "insufficient output amount of token"
        );
        IERC20(tokenAddress).transfer(_recipient, tokenPurchased);
        emit SwapTransfer(
            _recipient,
            address(this),
            msg.value,
            tokenPurchased,
            block.timestamp,
            "Ether to Token"
        );
    }

    function ethToTokenTransfer(uint256 _minTokenAmount, address _recipient)
        public
        payable
    {
        ethToToken(_minTokenAmount, _recipient);
    }

    function ethToTokenSwap(uint256 _minTokenAmount) public payable {
        ethToToken(_minTokenAmount, msg.sender);
    }

    function tokenToEthSwap(
        uint256 _tokensSold,
        uint256 _minExpectedAmountEther
    ) public {
        uint256 tokenReserve = getReserve();
        uint256 ethPurchased = getAmount(
            _tokensSold,
            tokenReserve,
            address(this).balance
        );
        require(
            ethPurchased >= _minExpectedAmountEther,
            "insufficient output amount of ether"
        );

        IERC20(tokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokensSold
        );
        payable(msg.sender).transfer(ethPurchased);
        emit SwapTransfer(
            msg.sender,
            address(this),
            _tokensSold,
            ethPurchased,
            block.timestamp,
            "Token to Ether"
        );
    }

    function tokenToTokenSwap(
        uint256 _tokensToSold,
        uint256 _minTokensPurchased,
        address _tokenAddress
    ) public {
        address exchangeAddress = IFactory(factoryAddress).getExchange(
            _tokenAddress
        );
        require(
            exchangeAddress != address(this) && exchangeAddress != address(0),
            "invalid exchange address"
        );

        uint256 tokenReserve = getReserve();
        uint256 ethPurchased = getAmount(
            _tokensToSold,
            tokenReserve,
            address(this).balance
        );
        IERC20(tokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokensToSold
        );
        IExchange(exchangeAddress).ethToTokenTransfer{value: ethPurchased}(
            _minTokensPurchased,
            msg.sender
        );
        emit SwapTransfer(
            msg.sender,
            address(this),
            _tokensToSold,
            _minTokensPurchased,
            block.timestamp,
            "Token to Token"
        );
    }
}
