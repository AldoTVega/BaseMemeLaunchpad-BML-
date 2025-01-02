use actix_web::web::Json;

use crate::model::signature_model::GenerateRequest;

use super::{initial_supply::make_initial_supply_contract, team_allocate::make_team_contract};

pub fn advance_purpose(data:Json<GenerateRequest>) {
    match &data.supply {
        Some(_supply) => {
            match &data.team_wallet_address {
                Some(_wallet) => {
                    make_team_contract(data).unwrap()
                },
                None => {make_initial_supply_contract(data).unwrap()},
            }
        },
        None => {}
    }
}