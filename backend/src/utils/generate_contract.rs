

use actix_web::web::Json;

use crate::model::signature_model::{GenerateRequest, Mode};
// use crate::utils::advance_contract::advance_contract::advance_purpose;
use crate::utils::advance_contract::full_contract::make_full_contract;
use crate::utils::basic_contract::make_basic_contract;
use crate::utils::script::write_script;

pub fn generate_contract(data: Json<GenerateRequest>) -> std::io::Result<String> {
    println!("hi");
    match data.mode {
        Mode::Basic => {
            make_basic_contract(data)?;
        }
        Mode::Advance => {
            make_full_contract(data)?;
        }
    }
    // Create a new file named "example.sol"

    // Write some content to the file
    let result = write_script();
    Ok(result)
}
