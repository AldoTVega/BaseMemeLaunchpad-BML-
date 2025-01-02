
use futures_util::StreamExt;
use mongodb::{bson::{doc, from_document}, error::Error, results::InsertOneResult, Client, Collection, Cursor};

use crate::model::{signature_model::Signature, user_tokens_model::UserTokens};
#[derive(Clone)]
pub struct Database {
    pub user_tokens:Collection<UserTokens>
}

impl Database {
    pub async fn _init() -> Self {
        let url = "mongodb+srv://zhongxi1992:1FIZfgsoYDkS0Bg3@cluster0.x56nkq9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0".to_string();

        
      let client =   Client::with_uri_str(url.clone()).await.unwrap();
           
       let db =client.database("BML");
       let user_tokens = db.collection("user_tokens");
        

       Database {
        user_tokens
    
    }}

    pub async fn create_user_tokens(&self,tokens:UserTokens) -> Result<InsertOneResult,Error> {

        let result = self.user_tokens.insert_one(tokens, None).await.ok().expect("Error creating tokens");
        Ok(result)
        
    }

    pub async fn get_user_tokens(&self,creator:String)-> Result<Vec<UserTokens>,Error> {
        let mut results = self.user_tokens.find(doc! {"creatorAddress":creator}, None).await.ok().expect("Error get user tokens ");

        let mut user_tokens = Vec::new();
        while let Some(result) = results.next().await {
            match result {
                Ok(doc) => user_tokens.push(doc),
                Err(err) => panic!("Error getting booking: {}", err),
            }
        }
        Ok(user_tokens)
    }


    pub async fn get_counts(&self) -> Result<u64,Error> {
        let result = self.user_tokens.count_documents(None, None).await.ok().expect("Error get count");
        Ok(result)
    }
    // pub async fn check_connection() -> Result<()> {
    //     let url = "mongodb://149.51.230.248:27017".to_string();
    //     let client = Client::with_uri_str(url.clone()).await?;
    //     client.list_database_names(None,None).await?;
    //     Ok(())
    // }
}