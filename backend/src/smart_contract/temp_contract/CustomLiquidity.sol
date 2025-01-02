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

contract CustomLiquidityToken is
    Initializable,
    ERC20Upgradeable,
    ERC20BurnableUpgradeable,
    ERC20PermitUpgradeable,
    OwnableUpgradeable
{
    uint256 public teamAllocation;
    uint256 public liqudityAllocation;
    IUniswapV2Router02 public uniswapRouter;
    IUniswapV2Pair public uniswapV2Pair;
    address public teamAddress;
    uint256 public tradeBurnRatio;
    uint256 public tradeFeeRatio;

    event Withdraw(address account, uint256 amount);

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
        //ratio [0] ;burnRatio [1]; feeRatio [2]; teamAllocationpercentage [3]; vestingDuration for team  [4]; liquidity
        __ERC20_init(name, symbol);
        __ERC20Burnable_init();
        __ERC20Permit_init(name);
        __Ownable_init(initialOwner);
        _mint(
            initialOwner,
            (_totalSupply * (100 - ratio[2] - ratio[4]) * 10**decimals) / 100
        );
        uniswapRouter = IUniswapV2Router02(
            0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24
            // 0x425141165d3DE9FEC831896C016617a52363b687 //sepolia
        ); //sepoila router
        //team
        teamAddress = _teamAddress;
        teamAllocation = (_totalSupply * ratio[2] * 10**decimals) / 100;
        liqudityAllocation = (_totalSupply * ratio[4] * 10**decimals) / 100;

        _mint(address(this), teamAllocation);
        _mint(address(this), liqudityAllocation);
        setVestingSchedule(teamAddress, teamAllocation, ratio[3]);
        //fee
        require(ratio[0] >= 0 && ratio[0] <= 5000, "TRADE_BURN_RATIO_INVALID");
        require(ratio[1] >= 0 && ratio[1] <= 5000, "TRADE_FEE_RATIO_INVALID");

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

    function addLiquidity(uint256 tokenAmount) public payable {
        require(
            balanceOf(_msgSender()) >= tokenAmount,
            "Insufficient token balance in sender account"
        );

        // Transfer tokens from sender to the contract
        // _transfer(_msgSender(), address(this), tokenAmount);

        // If the pair address is not set, create the pair
        if (address(uniswapV2Pair) == address(0)) {
            address pairAddress = IUniswapV2Factory(uniswapRouter.factory())
                .createPair(address(this), uniswapRouter.WETH());
            uniswapV2Pair = IUniswapV2Pair(pairAddress);
        }

        // Approve the Uniswap router to spend the specified token amount
        _approve(address(this), address(uniswapRouter), tokenAmount);

        // Try to add liquidity to the pool
        try
            uniswapRouter.addLiquidityETH{value: msg.value}(
                address(this),
                tokenAmount,
                0, // Slippage is unavoidable
                0, // Slippage is unavoidable
                owner(),
                block.timestamp + 300 // Deadline 5 minutes from now
            )
        {
            // Liquidity added successfully
        } catch {
            // Liquidity addition failed, refund tokens and Ether to user
            _transfer(address(this), _msgSender(), tokenAmount);
            payable(_msgSender()).transfer(msg.value);
        }
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
        uniswapV2Pair.transferFrom(msg.sender, address(this), liquidity);

        // Approve the router to withdraw the tokens from this contract
        uniswapV2Pair.approve(address(uniswapRouter), liquidity);

        // Call to Uniswap to remove liquidity, tokens are returned to this contract
        (uint256 amountA, uint256 amountB) = uniswapRouter.removeLiquidity(
            address(this),
            uniswapRouter.WETH(),
            liquidity,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            address(this),
            block.timestamp + 300 // deadline 5 minutes from now
        );

        // Burn the LP tokens held by the contract
        uniswapV2Pair.burn(address(this));

        // Optionally, transfer the withdrawn tokens to the user
        ERC20Upgradeable(address(this)).transfer(msg.sender, amountA);
        ERC20Upgradeable(uniswapRouter.WETH()).transfer(msg.sender, amountB);
    }

    function transfer(address to, uint256 value)
        public
        virtual
        override
        returns (bool)
    {
        address sender = _msgSender();

        // Perform the standard transfer
        _transfer(sender, to, value);

        // Handle burn and fee logic separately
        uint256 burnAmount = 0;
        uint256 feeAmount = 0;
        if (tradeBurnRatio > 0 && sender != owner()) {
            burnAmount = (value * tradeBurnRatio) / 10000;
            _burn(to, burnAmount);
        }

        if (tradeFeeRatio > 0 && sender != owner()) {
            feeAmount = (value * tradeFeeRatio) / 10000;
            _transfer(to, owner(), feeAmount);
        }

        return true;
    }

    function updateFee(uint256 _fee) public onlyOwner {
        require(_fee >= 0 && _fee <= 5000, "TRADE_FEE_RATIO_INVALID");
        tradeFeeRatio = _fee;
    }

    function updateBurnRatio(uint256 _ratio) public onlyOwner {
        require(_ratio >= 0 && _ratio <= 5000, "TRADE_BURN_RATIO_INVALID");
        tradeBurnRatio = _ratio;
    }

    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        address payable payableSender = payable(msg.sender);
        payableSender.transfer(amount);
        emit Withdraw(msg.sender, amount);
    }
}
