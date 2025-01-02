use std::{
    fs::File,
    io::{Result, Write},
};

use actix_web::web::Json;

use crate::model::signature_model::{GenerateParams, GenerateRequest};

pub fn make_full_contract(data: Json<GenerateRequest>) -> Result<()> {
    let data = data.into_inner().validate();
    let uniswap2_router_address = dotenv::var("UNISWAP2_ROUTER_ADDRESS").unwrap();
    println!("data==={:?}", data);
    let mut file = File::create("./src/smart_contract/contracts/MyToken.sol")?;

    file.write_all(
        format!(
            r#"
                pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";

contract {} is ERC20, ERC20Burnable, Ownable, ERC20Permit {{
    struct VestingSchedule {{
        uint256 totalAmount;
        uint256 amountClaimed;
        uint256 vestingStart;
        uint256 vestingDuration;
        uint256 lastClaimed;
        bool isActive;
    }}

    mapping(address => VestingSchedule) public vestingSchedules;

    IUniswapV2Router02 public immutable uniswapV2Router;
    address public uniswapV2Pair;

    address public marketingWallet;
    address public developmentWallet;
    address public liquidityWallet;
    address public constant deadAddress = address(0xdead);

    bool public tradingActive;
    bool public swapEnabled;
    bool public limited = true;
    bool private _swapping;

    uint256 public maxTransaction;
    uint256 public maxWallet;
    uint256 public swapTokensAtAmount;

    uint256 public maxSupply;

    uint256 public buyTotalFees;
    uint256 private _buyMarketingFee;
    uint256 private _buyDevelopmentFee;
    uint256 private _buyLiquidityFee;

    uint256 public sellTotalFees;
    uint256 private _sellMarketingFee;
    uint256 private _sellDevelopmentFee;
    uint256 private _sellLiquidityFee;

    uint256 private _tokensForMarketing;
    uint256 private _tokensForDevelopment;
    uint256 private _tokensForLiquidity;
    uint256 private _previousFee;

    mapping(address => bool) private _isExcludedFromFees;
    mapping(address => bool) private _isExcludedFromMaxTransaction;
    mapping(address => bool) private _automatedMarketMakerPairs;
    mapping(address => bool) private _isAdmin;
    address[] private admins;

    event ExcludeFromLimits(address indexed account, bool isExcluded);

    event ExcludeFromFees(address indexed account, bool isExcluded);

    event SetAutomatedMarketMakerPair(address indexed pair, bool indexed value);

    event marketingWalletUpdated(
        address indexed newWallet,
        address indexed oldWallet
    );

    event developmentWalletUpdated(
        address indexed newWallet,
        address indexed oldWallet
    );

    event liquidityWalletUpdated(
        address indexed newWallet,
        address indexed oldWallet
    );

    event SwapAndLiquify(
        uint256 tokensSwapped,
        uint256 ethReceived,
        uint256 tokensIntoLiquidity
    );

    uint256 public teamAllocation;

    event TokensAirdropped(uint256 totalWallets, uint256 totalTokens);
    event Log(string message, address value);

    constructor(
        address initialOwner,
        uint256 total_supply,
        address team_wallet,
        uint256 vesting_period
    )
        ERC20("{}", "{}")
        Ownable(initialOwner)
        ERC20Permit("{}")
    {{
        maxSupply = {};
        emit Log("message", owner());

        teamAllocation = ((total_supply * ({})) / (100)) * 10 ** 18;
  
        
        uniswapV2Router = IUniswapV2Router02(
            {uniswap2_router_address}
        );
        _approve(address(this), address(uniswapV2Router), type(uint256).max);
        _buyMarketingFee = {};
        _buyDevelopmentFee = {};
        _buyLiquidityFee = {};
        buyTotalFees = _buyMarketingFee + _buyDevelopmentFee + _buyLiquidityFee;

        _sellMarketingFee = {};
        _sellDevelopmentFee = {};
        _sellLiquidityFee = {};
        sellTotalFees =
            _sellMarketingFee +
            _sellDevelopmentFee +
            _sellLiquidityFee;
        _previousFee = sellTotalFees;
        maxTransaction = total_supply;
        maxWallet = total_supply / 50;
        swapTokensAtAmount = (total_supply * 1) / 1000;

        marketingWallet = initialOwner;
        developmentWallet = initialOwner;
        liquidityWallet = initialOwner;

        excludeFromFeesWith(initialOwner, true);
        excludeFromFeesWith(address(this), true);
        excludeFromFeesWith(deadAddress, true);
        excludeFromFeesWith(initialOwner, true);

        excludeFromMaxTransactionWih(initialOwner, true);
        excludeFromMaxTransactionWih(address(this), true);
        excludeFromMaxTransactionWih(deadAddress, true);
        excludeFromMaxTransactionWih(address(uniswapV2Router), true);
        excludeFromMaxTransactionWih(initialOwner, true);

        // _mint(initialOwner, (total_supply / 100) * 10);
      
        _mint(address(this), total_supply*10**18);

        setVestingSchedule(team_wallet, teamAllocation, vesting_period);
        admins.push(initialOwner);

        setAdmin( admins, true);
    }}

    receive() external payable {{}}

    

    // function burn(uint256 amount) public {{
    //     _burn(msg.sender, amount);
    // }}

    function setVestingSchedule(
        address teamMember,
        uint256 amount,
        uint256 _vestingPeriod
    ) internal {{
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
    }}

    function claimVestedTokens() public {{
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
    }}

    function mint(address to, uint256 amount) public onlyOwner {{
        require(totalSupply() + amount*10**18 <= maxSupply*10**18, "Exceeds max supply");
        _mint(to, amount);
    }}

    function addLiquidity() public onlyOwner {{
        require(!tradingActive, "Trading already active.");

        uniswapV2Pair = IUniswapV2Factory(uniswapV2Router.factory()).createPair(
            address(this),
            uniswapV2Router.WETH()
        );
        _approve(address(this), address(uniswapV2Pair), type(uint256).max);
        IERC20(uniswapV2Pair).approve(
            address(uniswapV2Router),
            type(uint256).max
        );

        _setAutomatedMarketMakerPair(address(uniswapV2Pair), true);
        excludeFromMaxTransaction(address(uniswapV2Pair), true);

        uniswapV2Router.addLiquidityETH{{value: address(this).balance}}(
            address(this),
            balanceOf(address(this)) - teamAllocation,
            0,
            0,
            owner(),
            block.timestamp
        );
    }}

    function enableTrading() public onlyOwner {{
        require(!tradingActive, "Trading already active.");
        tradingActive = true;
        swapEnabled = true;
    }}

    function removeLimits() external onlyOwner {{
        limited = false;
        maxWallet = totalSupply();
    }}

    function setAdmin(address[] memory _admins, bool set) internal {{
        for (uint256 i = 0; i < _admins.length; i++) {{
            _isAdmin[_admins[i]] = set;
        }}
    }}

    function setSwapEnabled(bool value) public onlyOwner {{
        swapEnabled = value;
    }}

    function setSwapTokensAtAmount(uint256 amount) public onlyOwner {{
        require(
            amount >= (totalSupply() * 1) / 100000,
            "ERC20: Swap amount cannot be lower than 0.001% total supply."
        );
        require(
            amount <= (totalSupply() * 5) / 1000,
            "ERC20: Swap amount cannot be higher than 0.5% total supply."
        );
        swapTokensAtAmount = amount;
    }}

    function setMaxWalletAndMaxTransaction(
        uint256 _maxTransaction,
        uint256 _maxWallet
    ) public onlyOwner {{
        require(
            _maxTransaction >= ((totalSupply() * 5) / 1000),
            "ERC20: Cannot set maxTxn lower than 0.5%"
        );
        require(
            _maxWallet >= ((totalSupply() * 5) / 1000),
            "ERC20: Cannot set maxWallet lower than 0.5%"
        );
        maxTransaction = _maxTransaction;
        maxWallet = _maxWallet;
    }}

    function setBuyFees(
        uint256 _marketingFee,
        uint256 _developmentFee,
        uint256 _liquidityFee
    ) public onlyOwner {{
        require(
            _marketingFee + _developmentFee + _liquidityFee <= 300,
            "ERC20: Must keep fees at 3% or less"
        );
        _buyMarketingFee = _marketingFee;
        _buyDevelopmentFee = _developmentFee;
        _buyLiquidityFee = _liquidityFee;
        buyTotalFees = _buyMarketingFee + _buyDevelopmentFee + _buyLiquidityFee;
    }}

    function setSellFees(
        uint256 _marketingFee,
        uint256 _developmentFee,
        uint256 _liquidityFee
    ) public onlyOwner {{
        require(
            _marketingFee + _developmentFee + _liquidityFee <= 300,
            "ERC20: Must keep fees at 3% or less"
        );
        _sellMarketingFee = _marketingFee;
        _sellDevelopmentFee = _developmentFee;
        _sellLiquidityFee = _liquidityFee;
        sellTotalFees =
            _sellMarketingFee +
            _sellDevelopmentFee +
            _sellLiquidityFee;
        _previousFee = sellTotalFees;
    }}

    function setMarketingWallet(address _marketingWallet) public onlyOwner {{
        require(_marketingWallet != address(0), "ERC20: Address 0");
        address oldWallet = marketingWallet;
        marketingWallet = _marketingWallet;
        emit marketingWalletUpdated(marketingWallet, oldWallet);
    }}

    function setDevelopmentWallet(address _developmentWallet) public onlyOwner {{
        require(_developmentWallet != address(0), "ERC20: Address 0");
        address oldWallet = developmentWallet;
        developmentWallet = _developmentWallet;
        emit developmentWalletUpdated(developmentWallet, oldWallet);
    }}

    function setLiquidityWallet(address _liquidityWallet) public onlyOwner {{
        require(_liquidityWallet != address(0), "ERC20: Address 0");
        address oldWallet = liquidityWallet;
        liquidityWallet = _liquidityWallet;
        emit liquidityWalletUpdated(liquidityWallet, oldWallet);
    }}

    function excludeFromMaxTransactionWih(address account, bool value)
        internal
    {{
        _isExcludedFromMaxTransaction[account] = value;
        emit ExcludeFromLimits(account, value);
    }}

    function excludeFromMaxTransaction(address account, bool value)
        public
        onlyOwner
    {{
        _isExcludedFromMaxTransaction[account] = value;
        emit ExcludeFromLimits(account, value);
    }}

    function bulkExcludeFromMaxTransaction(
        address[] calldata accounts,
        bool value
    ) public onlyOwner {{
        for (uint256 i = 0; i < accounts.length; i++) {{
            _isExcludedFromMaxTransaction[accounts[i]] = value;
            emit ExcludeFromLimits(accounts[i], value);
        }}
    }}

    function excludeFromFeesWith(address account, bool value) internal {{
        _isExcludedFromFees[account] = value;
        emit ExcludeFromFees(account, value);
    }}

    function excludeFromFees(address account, bool value) public onlyOwner {{
        _isExcludedFromFees[account] = value;
        emit ExcludeFromFees(account, value);
    }}

    function bulkExcludeFromFees(address[] calldata accounts, bool value)
        public
        onlyOwner
    {{
        for (uint256 i = 0; i < accounts.length; i++) {{
            _isExcludedFromFees[accounts[i]] = value;
            emit ExcludeFromFees(accounts[i], value);
        }}
    }}

    function withdrawStuckTokens(address tkn) public onlyOwner {{
        bool success;
        if (tkn == address(0))
            (success, ) = address(msg.sender).call{{
                value: address(this).balance
            }}("");
        else {{
            require(IERC20(tkn).balanceOf(address(this)) > 0, "No tokens");
            uint256 amount = IERC20(tkn).balanceOf(address(this));
            IERC20(tkn).transfer(msg.sender, amount);
        }}
    }}

    function isExcludedFromMaxTransaction(address account)
        public
        view
        returns (bool)
    {{
        return _isExcludedFromMaxTransaction[account];
    }}

    function isExcludedFromFees(address account) public view returns (bool) {{
        return _isExcludedFromFees[account];
    }}

    function _setAutomatedMarketMakerPair(address pair, bool value) internal {{
        _automatedMarketMakerPairs[pair] = value;

        emit SetAutomatedMarketMakerPair(pair, value);
    }}

    function transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {{
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        if (amount == 0) {{
            super._transfer(from, to, 0);
            return;
        }}

        if (
            from != owner() &&
            to != owner() &&
            to != address(0) &&
            to != deadAddress &&
            !_swapping
        ) {{
            if (!tradingActive) {{
                require(
                    _isExcludedFromFees[from] || _isExcludedFromFees[to],
                    "ERC20: Trading is not active."
                );
            }}

            if (limited && from == address(uniswapV2Pair)) {{
                // has to be the LP
                require(balanceOf(to) + amount <= maxWallet, "Forbid");
                require(_isAdmin[from] || _isAdmin[to], "Forbid");
            }}

            //when buy
            if (
                _automatedMarketMakerPairs[from] &&
                !_isExcludedFromMaxTransaction[to]
            ) {{
                require(
                    amount <= maxTransaction,
                    "ERC20: Buy transfer amount exceeds the maxTransaction."
                );
                require(
                    amount + balanceOf(to) <= maxWallet,
                    "ERC20: Max wallet exceeded"
                );
            }}
            //when sell
            else if (
                _automatedMarketMakerPairs[to] &&
                !_isExcludedFromMaxTransaction[from]
            ) {{
                require(
                    amount <= maxTransaction,
                    "ERC20: Sell transfer amount exceeds the maxTransaction."
                );
            }} else if (!_isExcludedFromMaxTransaction[to]) {{
                require(
                    amount + balanceOf(to) <= maxWallet,
                    "ERC20: Max wallet exceeded"
                );
            }}
        }}

        uint256 contractTokenBalance = balanceOf(address(this)) -
            teamAllocation;

        bool canSwap = contractTokenBalance >= swapTokensAtAmount;

        if (
            canSwap &&
            swapEnabled &&
            !_swapping &&
            !_automatedMarketMakerPairs[from] &&
            !_isExcludedFromFees[from] &&
            !_isExcludedFromFees[to]
        ) {{
            _swapping = true;

            _swapBack();

            _swapping = false;
        }}

        bool takeFee = !_swapping;

        if (_isExcludedFromFees[from] || _isExcludedFromFees[to]) {{
            takeFee = false;
        }}

        uint256 fees = 0;

        if (takeFee) {{
            // on sell
            if (_automatedMarketMakerPairs[to] && sellTotalFees > 0) {{
                fees = (amount * (sellTotalFees)) / (10000);
                _tokensForLiquidity +=
                    (fees * _sellLiquidityFee) /
                    sellTotalFees;
                _tokensForMarketing +=
                    (fees * _sellMarketingFee) /
                    sellTotalFees;
                _tokensForDevelopment +=
                    (fees * _sellDevelopmentFee) /
                    sellTotalFees;
            }}
            // on buy
            else if (_automatedMarketMakerPairs[from] && buyTotalFees > 0) {{
                fees = (amount * (buyTotalFees)) / (10000);
                _tokensForLiquidity += (fees * _buyLiquidityFee) / buyTotalFees;
                _tokensForMarketing += (fees * _buyMarketingFee) / buyTotalFees;
                _tokensForDevelopment +=
                    (fees * _buyDevelopmentFee) /
                    buyTotalFees;
            }}

            if (fees > 0) {{
                super._transfer(from, address(this), fees);
            }}

            amount -= fees;
        }}

        super._transfer(from, to, amount);
        sellTotalFees = _previousFee;
    }}

    function _swapTokensForETH(uint256 tokenAmount) internal {{
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapV2Router.WETH();

        _approve(address(this), address(uniswapV2Router), tokenAmount);

        // make the swap
        uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0,
            path,
            address(this),
            block.timestamp
        );
    }}

    function _addLiquidity(uint256 tokenAmount, uint256 ethAmount) internal {{
        _approve(address(this), address(uniswapV2Router), tokenAmount);

        uniswapV2Router.addLiquidityETH{{value: ethAmount}}(
            address(this),
            tokenAmount,
            0,
            0,
            liquidityWallet,
            block.timestamp
        );
    }}

    function _swapBack() internal {{
        uint256 contractBalance = balanceOf(address(this)) - teamAllocation;
        uint256 totalTokensToSwap = _tokensForLiquidity +
            _tokensForMarketing +
            _tokensForDevelopment;
        bool success;

        if (contractBalance == 0 || totalTokensToSwap == 0) {{
            return;
        }}

        if (contractBalance > swapTokensAtAmount * 10) {{
            contractBalance = swapTokensAtAmount * 10;
        }}

        uint256 liquidityTokens = (contractBalance * _tokensForLiquidity) /
            totalTokensToSwap /
            2;
        uint256 amountToSwapForETH = contractBalance - liquidityTokens;

        uint256 initialETHBalance = address(this).balance;

        _swapTokensForETH(amountToSwapForETH);

        uint256 ethBalance = address(this).balance - initialETHBalance;

        uint256 ethForMarketing = (ethBalance * (_tokensForMarketing)) /
            (totalTokensToSwap);

        uint256 ethForDevelopment = (ethBalance * (_tokensForDevelopment)) /
            (totalTokensToSwap);

        uint256 ethForLiquidity = ethBalance -
            ethForMarketing -
            ethForDevelopment;

        _tokensForLiquidity = 0;
        _tokensForMarketing = 0;
        _tokensForDevelopment = 0;

        if (liquidityTokens > 0 && ethForLiquidity > 0) {{
            _addLiquidity(liquidityTokens, ethForLiquidity);
            emit SwapAndLiquify(
                amountToSwapForETH,
                ethForLiquidity,
                _tokensForLiquidity
            );
        }}

        (success, ) = address(developmentWallet).call{{value: ethForDevelopment}}(
            ""
        );

        (success, ) = address(marketingWallet).call{{
            value: address(this).balance
        }}("");
    }}

    function airdrop(
        address[] calldata addresses,
        uint256[] calldata tokenAmounts
    ) external onlyOwner {{
        require(addresses.length <= 250, "More than 250 wallets");
        require(
            addresses.length == tokenAmounts.length,
            "List length mismatch"
        );

        uint256 airdropTotal = 0;
        for (uint256 i = 0; i < addresses.length; i++) {{
            airdropTotal += tokenAmounts[i];
        }}
        require(balanceOf(msg.sender) >= airdropTotal, "Token balance too low");

        for (uint256 i = 0; i < addresses.length; i++) {{
          
            super._transfer(msg.sender, addresses[i], tokenAmounts[i]);

        }}

        emit TokensAirdropped(addresses.length, airdropTotal);
    }}
}}

            "#,
            format!("{}Token", data.name),
            data.name,
            data.symbol,
            data.name,
            data.total_supply,
            data.team_distribution_percentage,
            data.buy_marketing_fee,
            data.buy_development_fee,
            data.buy_liquidity_fee,
            data.sell_marketing_fee,
            data.sell_development_fee,
            data.sell_liquidity_fee
        )
        .as_bytes(),
    )?;
    println!("File 'example.sol' created successfully in Advanced MOde!");
    make_deploy_ts(data).unwrap();
    Ok(())
}

fn make_deploy_ts(data: GenerateParams) -> std::io::Result<()> {
    let mut file = File::create("./src/smart_contract/ignition/modules/Token.ts")?;

    file.write_all(
        format!(
            r#"
        const {{ buildModule }} = require("@nomicfoundation/hardhat-ignition/modules");

        const TokenModule = buildModule("TokenModule", (m:any) => {{
        
        const owner = m.getParameter("initialOwner","{}");
        const total_supply = m.getParameter("total_supply","{}");
        const team_wallet = m.getParameter("team_wallet","{}");
        const vesting_period = m.getParameter("vesting_period",{});
       
        const token = m.contract("{}",[owner,total_supply,team_wallet,vesting_period]);

        return {{ token }};
        }});

        module.exports = TokenModule;
    "#,
            data.owner,
            data.supply,
            data.team_wallet_address,
            data.unlock_time,
            format!("{}Token", data.name),
        )
        .as_bytes(),
    )?;
    Ok(())
}
