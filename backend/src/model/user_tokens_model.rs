use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct UserTokens {
    pub _id: ObjectId,
    #[serde(rename = "tokenAddress")]
    pub token_address: String,
    #[serde(rename = "creatorAddress")]
    pub creator_address: String,

    pub token_type: TokenType,
    pub select:Vec<String>
}
#[derive(Debug, Serialize, Deserialize)]
pub struct UserTokensRequest {
    #[serde(rename = "tokenAddress")]
    pub token_address: String,
    #[serde(rename = "creatorAddress")]
    pub creator_address: String,

    #[serde(rename = "tokenType")]
    pub token_type: TokenType,
    pub select:Vec<String>
}

#[derive(Debug, Serialize, Deserialize,Clone)]
#[serde(rename_all = "snake_case")]
pub enum TokenType {
    Basic,

    Custom,

    CustomMint,
    LiqMint
}

impl TryFrom<UserTokensRequest> for UserTokens {
    type Error = Box<dyn std::error::Error>;

    fn try_from(value: UserTokensRequest) -> Result<Self, Self::Error> {
        Ok(Self {
            _id:ObjectId::new(),
            token_address:value.token_address,
            creator_address:value.creator_address,
            token_type:value.token_type,
            select:value.select
        })
    }
}
