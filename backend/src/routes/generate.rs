use actix_web::{
    get, post, put,
    web::{Data, Json, Path},
    Error, HttpResponse, Responder,
};

use crate::{
    model::{
        signature_model::{GenerateRequest, GenerateResponse},
        user_tokens_model::{UserTokens, UserTokensRequest},
    },
    services::db::Database,
    utils::generate_contract::generate_contract,
};

#[post("/generate")]
pub async fn generate(req: Json<GenerateRequest>) -> Result<HttpResponse, Error> {
    println!("req={:?} ", req);
    match generate_contract(req) {
        Ok(e) => {
            println!("rrr={}", e);
            if e == "deploy is failed " {
                Err(actix_web::error::ErrorExpectationFailed(e))
            } else {
                Ok(HttpResponse::Ok().json(GenerateResponse { url: e }))
            }
            // Handle success, possibly using 'e'
        }
        Err(e) => {
            println!("error=={}", e);
            return Err(actix_web::error::ErrorInternalServerError(
                "Error processing request",
            ));
        }
    }
    // Ok(HttpResponse::Ok().json("success"))
}

#[post("/create")]
pub async fn create(db: Data<Database>, req: Json<UserTokensRequest>) -> HttpResponse {
    println!("req={:?} ", req);
    match db
        .create_user_tokens(
            UserTokens::try_from(UserTokensRequest {
                token_address: req.token_address.clone(),
                creator_address: req.creator_address.clone(),
                token_type: req.token_type.clone(),
                select:req.select.clone()
            })
            .expect("Error converting TokenRequest to Token"),
        )
        .await
    {
        Ok(tokens) => HttpResponse::Ok().json(tokens),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/get/{creator_address}")]
pub async fn get_user_token(db: Data<Database>, path: Path<String>) -> impl Responder {
    let creator_address = path.into_inner();
    match db.get_user_tokens(creator_address).await {
        Ok(result) => HttpResponse::Ok().json(result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}
#[get("/get_count")]
pub async fn get_count(db: Data<Database>) -> impl Responder {
    
    match db.get_counts().await {
        Ok(result) => HttpResponse::Ok().json(result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}
