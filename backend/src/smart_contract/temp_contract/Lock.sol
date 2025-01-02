// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// MyToken contract as before
contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        _mint(msg.sender, initialSupply);
    }
}

// Enhanced LiquidityPool contract with LP token burn functionality
contract LiquidityPool is ERC20 {
    ERC20 public baseToken;

    constructor(address _baseTokenAddress)
        ERC20("LiquidityProviderToken", "LPT")
    {
        baseToken = ERC20(_baseTokenAddress);
    }

    function deposit(uint256 amount) public {
        // Transfer base tokens from user to the contract
        require(baseToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        // Issue LP tokens to the user, 1:1 ratio for simplicity
        _mint(msg.sender, amount);
    }

    function withdraw(uint256 amount) public {
        // Ensure the user has enough LP tokens to burn
        require(balanceOf(msg.sender) >= amount, "Insufficient LP tokens");
        // Burn the LP tokens
        _burn(msg.sender, amount);
        // Transfer base tokens back to the user
        require(baseToken.transfer(msg.sender, amount), "Transfer failed");
    }

    // New function to remove liquidity and burn LP tokens
    function removeLiquidity(uint256 amount) public {
        // User must have at least the amount of LP tokens they want to burn
        require(balanceOf(msg.sender) >= amount, "Insufficient LP tokens");
        // Calculate the share of the pool the LP tokens represent
        uint256 baseTokenAmount = (baseToken.balanceOf(address(this)) * amount) / totalSupply();
        // Burn the LP tokens from the user's balance
        _burn(msg.sender, amount);
        // Transfer the proportionate amount of base tokens to the user
        require(baseToken.transfer(msg.sender, baseTokenAmount), "Transfer failed");
    }
}
