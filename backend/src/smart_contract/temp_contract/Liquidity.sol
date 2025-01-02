// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;


import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";



contract CustomLiquidityToken is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, ERC20PermitUpgradeable, OwnableUpgradeable {
      mapping(address => uint256) private _buyBlock;
    bool public checkBot = true;
    
    uint256 public teamAllocation;
    IUniswapV2Router02 public uniswapRouter;
    IUniswapV2Pair public uniswapPair;
     address public teamAddress;
    uint256 public tradeBurnRatio;
    uint256 public tradeFeeRatio;


       struct VestingSchedule {
        uint256 totalAmount;
        uint256 amountClaimed;
        uint256 vestingStart;
        uint256 vestingDuration;
        uint256 lastClaimed;
        bool isActive;
    }

    mapping(address => VestingSchedule) public vestingSchedules;

     constructor() {
        _disableInitializers();
    }

    function init(
        address initialOwner,
        uint256 _totalSupply,
        string memory name,
        string memory symbol,
        uint256 decimals,
        address _teamAddress,
        uint256[] memory ratio
    ) public initializer {
        //ratio [0] ;burnRatio [1]; feeRatio [2]; teamAllocationpercentage [3]; vestingDuration for team
        __ERC20_init(name, symbol);
        __ERC20Burnable_init();
        __ERC20Permit_init(name);
        __Ownable_init(initialOwner);
        _mint(initialOwner, (_totalSupply*(1-ratio[2])) * 10 ** decimals);
        uniswapRouter = IUniswapV2Router02(0x6BDED42c6DA8FBf0d2bA55B2fa120C5e0c8D7891);
        //team
        teamAddress = _teamAddress;
        teamAllocation = _totalSupply * ratio[2] * 10 ** decimals;
        _mint(address(this),teamAllocation);
        setVestingSchedule(teamAddress, teamAllocation, ratio[3]);
        //fee
        tradeBurnRatio = ratio[0];
        tradeFeeRatio = ratio[1];

    }
   function setVestingSchedule(
        address teamMember,
        uint256 amount,
        uint256 _vestingPeriod
    ) internal {
        require(
            amount <= teamAllocation,
            "Not enough tokens allocated for vesting"
        );
        VestingSchedule storage schedule = vestingSchedules[teamMember];
        schedule.totalAmount = amount;
        schedule.vestingStart = block.timestamp;
        schedule.vestingDuration = _vestingPeriod;
        schedule.amountClaimed = 0;
        schedule.lastClaimed = block.timestamp;
        schedule.isActive = true;
    }

     function claimVestedTokens() public {
        VestingSchedule storage schedule = vestingSchedules[msg.sender];
        require(
            schedule.isActive,
            "You do not have an active vesting schedule."
        );
        require(
            block.timestamp > schedule.vestingStart,
            "Vesting has not started yet"
        );

        uint256 timeElapsed = block.timestamp - schedule.lastClaimed;
        uint256 releaseAmount = (schedule.totalAmount * timeElapsed) /
            schedule.vestingDuration;

        require(releaseAmount > 0, "No vested tokens available to claim");
        require(
            schedule.amountClaimed + releaseAmount <= schedule.totalAmount,
            "Claim exceeds allocation"
        );

        schedule.amountClaimed += releaseAmount;
        schedule.lastClaimed = block.timestamp;

        _transfer(address(this), msg.sender, releaseAmount);
    }
    

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) public payable {
        _approve(address(this), address(uniswapRouter), tokenAmount);
        uniswapRouter.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0, // Slippage is unavoidable
            0, // Slippage is unavoidable
            owner(),
            block.timestamp + 300 // Deadline 5 minutes from now
        );
    }

    function removeLiquidity(uint256 liquidity) public {
        uniswapRouter.removeLiquidityETH(
            address(this),
            liquidity,
            0, // Slippage is unavoidable
            0, // Slippage is unavoidable
            msg.sender,
            block.timestamp + 300 // Deadline 5 minutes from now
        );
    }

    function removeLiquidityAndBurnLP(uint256 liquidity) public {
        // Transfer LP tokens from the user to the contract
        uniswapPair.transferFrom(msg.sender, address(this), liquidity);

        // Approve the router to withdraw the tokens from this contract
        uniswapPair.approve(address(uniswapRouter), liquidity);

        // Call to Uniswap to remove liquidity, tokens are returned to this contract
        (uint amountA, uint amountB) = uniswapRouter.removeLiquidity(
            address(this),
            uniswapRouter.WETH(),
            liquidity,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            address(this),
            block.timestamp + 300 // deadline 5 minutes from now
        );

        // Burn the LP tokens held by the contract
        uniswapPair.burn(address(this));

        // Optionally, transfer the withdrawn tokens to the user
        ERC20Upgradeable(address(this)).transfer(msg.sender, amountA);
        ERC20Upgradeable(uniswapRouter.WETH()).transfer(msg.sender, amountB);
    }

     function transfer(address to, uint256 value) public virtual override  returns (bool) {
        address sender = _msgSender();
         uint256 burnAmount;
        uint256 feeAmount;
        if(tradeBurnRatio > 0) {
            burnAmount = value* tradeBurnRatio / 10000;
           _burn(sender,burnAmount);
        }

        if(tradeFeeRatio > 0) {
            feeAmount = value*tradeFeeRatio/10000;
            transferFrom(msg.sender,owner(),feeAmount);
        }
        
        uint256 receiveAmount = value-burnAmount-feeAmount;
        _transfer(sender, to, receiveAmount);
        return true;
    }

}

    // receive() external payable {}
// }