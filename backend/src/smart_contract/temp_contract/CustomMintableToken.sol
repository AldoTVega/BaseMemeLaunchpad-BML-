// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract CustomMintableToken is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, OwnableUpgradeable, ERC20PermitUpgradeable {
     uint256 public tradeBurnRatio;
    uint256 public tradeFeeRatio;
    constructor() {
        _disableInitializers();
    }

    function init(address _creator,
        uint256 _totalSupply,
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _tradeBurnRatio,
        uint256 _tradeFeeRatio
        ) initializer public {
        __ERC20_init(_name, _symbol);
        __ERC20Permit_init(_name);
        __Ownable_init(_creator);
        _mint(_creator, _totalSupply * 10 ** _decimals);
        require(_tradeBurnRatio >= 0 && _tradeBurnRatio <= 5000, "TRADE_BURN_RATIO_INVALID");
        require(_tradeFeeRatio >= 0 && _tradeFeeRatio <= 5000, "TRADE_FEE_RATIO_INVALID");

        tradeBurnRatio=_tradeBurnRatio;
        tradeFeeRatio =_tradeFeeRatio;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
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
}