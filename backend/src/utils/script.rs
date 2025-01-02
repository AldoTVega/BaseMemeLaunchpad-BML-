use std::{fs, io, process::Command};

use regex::Regex;

pub fn write_script() -> String {
    // Change directory using current_dir() instead of cd command
    let output = Command::new("cmd")
        .current_dir("./src/smart_contract") // Setting the directory directly
        .args(["/C", "npm run compile"])
        .output()
        .expect("Failed to execute command");

    // Check if the command was executed successfully
    if output.status.success() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        println!("Output: {}", stdout);
        let result = Command::new("cmd").current_dir("./src/smart_contract").args(["/C"," echo y | npx hardhat ignition deploy .\\ignition\\modules\\Token.ts --network base-sepolia --verify
        "]).output().expect("msg");
        if result.status.success() {
            println!(
                "result:::::::::::::::::{}",
                String::from_utf8_lossy(&result.stdout)
            );

            delete_folder_and_file().unwrap();
            if let Some(e) = extract_url(&String::from_utf8_lossy(&result.stdout)) {
                println!("result=={}", e);
                return e.to_string();
            } else {
                return "deploy is failed ".to_string();
            }
        } else {
            return "deploy is failed ".to_string();
        }
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        eprintln!("Error: {}", stderr);
        return "deploy is failed ".to_string();
    }
}

fn delete_folder(path: &str) -> io::Result<()> {
    if fs::metadata(path).is_ok() {
        fs::remove_dir_all(path)?;
        println!("Folder '{}' and its contents deleted successfully.", path);
    } else {
        println!("Folder '{}' does not exist.", path);
    }
    Ok(())
}

fn delete_file(path: &str) -> io::Result<()> {
    if fs::metadata(path).is_ok() {
        fs::remove_file(path)?;
        println!("File '{}' deleted successfully.", path);
    } else {
        println!("File '{}' does not exist.", path);
    }
    Ok(())
}

fn delete_folder_and_file() -> io::Result<()> {
    let folders = [
        "./src/smart_contract/artifacts",
        "./src/smart_contract/cache",
        "./src/smart_contract/typechain-types",
        "./src/smart_contract/ignition/deployments",
    ];

    for folder in folders.iter() {
        delete_folder(folder)?;
    }

    let file_path = "./src/smart_contract/ignition/modules/Token.ts";
    delete_file(file_path)?;

    Ok(())
}

fn extract_url(input: &str) -> Option<&str> {
    let re = Regex::new(r"https://[^\s]+").unwrap();
    re.find(input).map(|m| m.as_str())
}
