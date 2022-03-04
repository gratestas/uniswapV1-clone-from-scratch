// SPDX-License-Identifier: Unlinsenced
pragma solidity ^0.8.0;

import "./Exchange.sol";

contract Factory {
    //allows to find exchanges by their tokens
    mapping(address => address) public tokenToExchange;

    function createExchange(address _tokenAddress) public returns (address) {
        require(_tokenAddress != address(0), "invalid token address");
        require(
            tokenToExchange[_tokenAddress] == address(0),
            "exchange already exists"
        );

        // creates a new instance of exchange for a token address
        Exchange exchange = new Exchange(_tokenAddress);
        tokenToExchange[_tokenAddress] = address(exchange);

        return address(exchange);
    }

    function getExchange(address _tokenAddress) public view returns (address) {
        return tokenToExchange[_tokenAddress];
    }

    function doesExchangeExist(address _tokenAddress)
        public
        view
        returns (bool)
    {
        return tokenToExchange[_tokenAddress] != address(0);
    }
}
