use std::{
    fs::File,
    io::{Result, Write},
};

use actix_web::web::Json;

use crate::model::signature_model::GenerateRequest;

pub fn make_initial_supply_contract(data: Json<GenerateRequest>) -> Result<()> {
    let mut file = File::create("./src/smart_contract/contracts/MyToken.sol")?;

    file.write_all(
        b"
                // SPDX-License-Identifier: MIT\n
                // Compatible with OpenZeppelin Contracts ^5.0.0\n
                pragma solidity ^0.8.20;\n
                
                import \"@openzeppelin/contracts/token/ERC20/ERC20.sol\";\n
                import \"@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol\";\n
                import \"@openzeppelin/contracts/access/Ownable.sol\";\n
                import \"@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol\";\n\n
                
                contract MyToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {
                  
        
                    constructor(address initialOwner,string memory _name, string memory _symbol,uint256 initialSupply )
                        ERC20(_name, _symbol)
                        Ownable(initialOwner)
                        ERC20Permit(_name)
                    {
                        _mint(initialOwner,initialSupply*10**18);
                    }
                
                    function mint(address to, uint256 amount) public onlyOwner {
                        _mint(to, amount);
                    }
                }
            ",
    )?;
    println!("File 'example.sol' created successfully in Advanced MOde!");
    make_deploy_ts(&data).unwrap();
    Ok(())
}

fn make_deploy_ts(data: &Json<GenerateRequest>) -> std::io::Result<()> {
    let mut file = File::create("./src/smart_contract/ignition/modules/Token.ts")?;

    file.write_all(
        format!(
            r#"
        const {{ buildModule }} = require("@nomicfoundation/hardhat-ignition/modules");

        const TokenModule = buildModule("TokenModule", (m:any) => {{
        const tokenName = m.getParameter("_name", "{}");
        const tokenSymbol = m.getParameter("_symbol", "{}");
        const owner = m.getParameter("initialOwner","{}");
        const initialSupply = m.getParameter("initialSupply","{}");
        const token = m.contract("MyToken",[owner,tokenName,tokenSymbol,initialSupply]);

        return {{ token }};
        }});

        module.exports = TokenModule;
    "#,
            data.name,
            data.symbol,
            data.owner,
            data.supply.unwrap_or_else(|| 10000)
        )
        .as_bytes(),
    )?;
    Ok(())
}
