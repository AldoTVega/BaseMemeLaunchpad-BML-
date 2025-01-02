mod model;
mod routes;
mod services;
mod utils;
use actix_cors::Cors;
use actix_web::web::{scope, Data};
use actix_web::{middleware::Logger, App, HttpServer};
use dotenv::dotenv;
use env_logger::Env;
use routes::generate::generate;

use crate::routes::generate::{create, get_count, get_user_token};
use crate::services::db::Database;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();
    dotenv().ok();
    let db = Database::_init().await;
    let db_data = Data::new(db);

    let server = HttpServer::new(move || {
        App::new().app_data(db_data.clone())
            .wrap(Logger::default())
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_header()
                    .allow_any_method(),
            )
            .service(scope("/api").service(generate).service(create).service(get_user_token).service(get_count))
        // .app_data(db_data.clone())
    })
    .bind(("0.0.0.0", 5006))?;

    // Log a message indicating that the server is running
    println!("Server is running on port 5006");

    server.run().await
    // println!("Hello, world!");
}
