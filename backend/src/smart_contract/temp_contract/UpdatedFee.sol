// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public tradingFeeRate = 100; // Initial fee rate, 1.00%
    uint256 public constant FEE_DENOMINATOR = 10000; // Denominator to calculate fees
    address public feeAddress; // Address where trading fees are collected

    event FeeRateUpdated(uint256 newRate);

    constructor(uint256 initialSupply, address _feeAddress)
        ERC20("MyToken", "MTK")
        Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply);
        feeAddress = _feeAddress;
    }

    function updateTradingFee(uint256 newFee) public onlyOwner {
        require(newFee <= 500, "Fee cannot exceed 5%"); // Maximum fee rate of 5.00%
        tradingFeeRate = newFee;
        emit FeeRateUpdated(newFee);
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        uint256 fee = calculateFee(amount);
        uint256 amountAfterFee = amount - fee;

        _transfer(_msgSender(), feeAddress, fee); // Transfer the fee
        return super.transfer(recipient, amountAfterFee);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        uint256 fee = calculateFee(amount);
        uint256 amountAfterFee = amount - fee;

        _transfer(sender, feeAddress, fee); // Transfer the fee
        return super.transferFrom(sender, recipient, amountAfterFee);
    }

    function calculateFee(uint256 amount) private view returns (uint256) {
        return amount * tradingFeeRate / FEE_DENOMINATOR;
    }
}
