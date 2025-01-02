// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MyToken is ERC20, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    uint256 public constant TEAM_ALLOCATION = 1000000 * (10 ** 18); // 1 million tokens, adjust accordingly
    uint256 public totalTeamClaimed = 0;
    uint256 public vestingStart;
    uint256 public vestingDuration = 365 days; // Vesting over one year
    address public teamWallet;

    constructor(uint256 initialSupply, address _teamWallet)
        ERC20("MyToken", "MTK")
        Ownable(_teamWallet) // Pass the team wallet or another address as the initial owner
    {
        _mint(msg.sender, initialSupply);
        teamWallet = _teamWallet;
        vestingStart = block.timestamp;
        transferOwnership(_teamWallet); // Optionally transfer ownership if needed
    }

    function claimTeamTokens() public onlyOwner nonReentrant {
        require(msg.sender == teamWallet, "Only the designated team wallet can claim tokens.");
        uint256 timeElapsed = block.timestamp.sub(vestingStart);
        uint256 totalVestable = TEAM_ALLOCATION.mul(timeElapsed).div(vestingDuration);
        uint256 claimable = totalVestable.sub(totalTeamClaimed);

        require(claimable > 0, "No tokens available for claiming yet.");

        totalTeamClaimed = totalTeamClaimed.add(claimable);
        _mint(teamWallet, claimable);
        emit TeamTokensClaimed(claimable);
    }

    event TeamTokensClaimed(uint256 amount);
}
