use chrono::{DateTime, Local};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Signature {
    pub _id: String,
    pub status: bool,
}
#[derive(Debug, Deserialize, Serialize, Clone, Copy)]
pub enum Mode {
    #[serde(rename = "advance")]
    Advance,
    #[serde(rename = "basic")]
    Basic,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct GenerateRequest {
    pub mode: Mode,
    pub name: String,
    pub symbol: String,
    pub decimal: Option<u128>,
    pub supply: Option<u128>,
    #[serde(rename = "maxBuy")]
    pub max_buy: Option<u128>,
    #[serde(rename = "initialLP")]
    pub initial_lp: Option<u128>,
    pub owner: String,
    pub mintable: Option<bool>,
    #[serde(rename = "sellMarketingFee")]
    pub sell_marketing_fee: Option<i8>,
    #[serde(rename = "totalSupply")]
    pub total_supply: Option<u128>,
    #[serde(rename = "sellDevelopmentFee")]
    pub sell_development_fee: Option<i8>,
    #[serde(rename = "sellLiquidityFee")]
    pub sell_liquidity_fee: Option<i8>,
    #[serde(rename = "buyMarketingFee")]
    pub buy_marketing_fee: Option<i8>,
    #[serde(rename = "buyDevelopmentFee")]
    pub buy_development_fee: Option<i8>,
    #[serde(rename = "buyLiquidityFee")]
    pub buy_liquidity_fee: Option<i8>,
    #[serde(rename = "teamWalletAddress")]
    pub team_wallet_address: Option<String>,
    #[serde(rename = "teamDistributionPercentage")]
    pub team_distribution_percentage: Option<i8>,
    #[serde(rename = "unlockTime")]
    pub unlock_time: Option<String>,
    #[serde(rename = "liquidityAdd")]
    pub liquidity_add:bool
}
#[derive(Debug)]
pub struct GenerateParams {
    pub mode: Mode,
    pub name: String,
    pub symbol: String,
    pub decimal: u128,
    pub supply: u128,
    pub max_buy: u128,
    pub initial_lp: u128,
    pub owner: String,
    pub mintable: bool,
    pub sell_liquidity_fee: i8,
    pub total_supply: u128,
    pub sell_development_fee: i8,
    pub sell_marketing_fee: i8,
    pub buy_marketing_fee: i8,
    pub buy_development_fee: i8,
    pub buy_liquidity_fee: i8,
    pub team_wallet_address: String,
    pub team_distribution_percentage: i8,
    pub unlock_time: i64,
    pub liquidity_add:bool
}
#[derive(Debug, Deserialize, Serialize)]
pub struct GenerateResponse {
    pub url: String,
}

impl GenerateRequest {
    pub fn validate(&self) -> GenerateParams {
        let dt = match DateTime::parse_from_str(
            &self.unlock_time.clone().unwrap(),
            "%m/%d/%Y, %I:%M:%S %p",
        ) {
            Ok(dt) => dt.with_timezone(&Local),
            Err(_) => Local::now(),
        };

        // Extract the timestamp from the DateTime object
        let time = dt.timestamp();

        let total_sup = if self.mintable.unwrap_or(false) {
            self.total_supply.unwrap_or(self.supply.unwrap_or(1000000))
        }else {
            self.supply.unwrap_or(10000000)
        };

        GenerateParams {
            mode: self.mode.clone(),
            name: self.name.clone(),
            symbol: self.symbol.clone(),
            decimal: self.decimal.clone().unwrap_or(0),
            supply: self.supply.clone().unwrap_or(1000000),
            max_buy: self.max_buy.clone().unwrap_or(1000000),
            initial_lp: self.initial_lp.clone().unwrap_or(800000),
            owner: self.owner.clone(),
            mintable: self.mintable.unwrap_or(false),
            buy_liquidity_fee: self.buy_liquidity_fee.clone().unwrap_or(0),
            total_supply: total_sup,
            
            team_wallet_address: self
                .team_wallet_address
                .clone()
                .unwrap_or(self.owner.clone()),
            team_distribution_percentage: self.team_distribution_percentage.clone().unwrap_or(0),
            unlock_time: time,
            sell_liquidity_fee:self.sell_liquidity_fee.unwrap_or(0),
            sell_development_fee:self.sell_development_fee.unwrap_or(0),
            sell_marketing_fee: self.sell_marketing_fee.unwrap_or(0),
            buy_marketing_fee: self.buy_marketing_fee.unwrap_or(0),
            buy_development_fee: self.buy_development_fee.unwrap_or(0),
            liquidity_add: self.liquidity_add,
        }
    }
}
