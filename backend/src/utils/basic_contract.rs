use std::{
    fs::File,
    io::{Result, Write},
};

use actix_web::web::Json;

use crate::model::signature_model::GenerateRequest;

pub fn make_basic_contract(data: Json<GenerateRequest>) -> Result<()> {
    let mut file = File::create("./src/smart_contract/contracts/MyToken.sol")?;

    file.write_all(
        format!(
            r#"
                // SPDX-License-Identifier: MIT
                // Compatible with OpenZeppelin Contracts ^5.0.0
                pragma solidity ^0.8.20;
                
                import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
                import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
                import "@openzeppelin/contracts/access/Ownable.sol";
                import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
                
                contract {} is ERC20, ERC20Burnable, Ownable, ERC20Permit {{
                  
        
                    constructor(address initialOwner,string memory _name, string memory _symbol )
                        ERC20(_name, _symbol)
                        Ownable(initialOwner)
                        ERC20Permit(_name)
                    {{
                        _mint(address(this),1000000000*10**18);
                    }}
                
                    function mint(address to, uint256 amount) public onlyOwner {{
                        _mint(to, amount);
                    }}
                }}"#,
            format!("{}Token", data.name)
        )
        .as_bytes(),
    )?;
    println!("File 'example.sol' created successfully!");
    make_deploy_ts(&data.name, &data.symbol, &data.owner).unwrap();
    Ok(())
}
fn make_deploy_ts(token_name: &str, symbol: &str, address: &str) -> std::io::Result<()> {
    let mut file = File::create("./src/smart_contract/ignition/modules/Token.ts")?;

    file.write_all(
        format!(
            r#"
        const {{ buildModule }} = require("@nomicfoundation/hardhat-ignition/modules");

        const TokenModule = buildModule("TokenModule", (m:any) => {{
        const tokenName = m.getParameter("_name", "{}");
        const tokenSymbol = m.getParameter("_symbol", "{}");
        const owner = m.getParameter("initialOwner","{}");
        const token = m.contract("{}",[owner,tokenName,tokenSymbol]);

        return {{ token }};
        }});

        module.exports = TokenModule;
    "#,
            token_name,
            symbol,
            address,
            format!("{}Token", token_name)
        )
        .as_bytes(),
    )?;
    Ok(())
}
