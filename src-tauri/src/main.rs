#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// 1. Import dependencies
use serde::Serialize;
use ssh2::Session;
use std::net::TcpStream;
use std::io::{Read, Write};
use std::fs::File;
use std::path::Path;

// 2. Define a struct for file info to send to frontend
#[derive(Serialize)]
struct FileInfo {
    name: String,
    is_dir: bool,
    size: Option<u64>,
}

// 3. Helper: Connect to SFTP server
fn connect_sftp(
    ip: &str,
    port: u16,
    username: &str,
    password: &str,
) -> Result<ssh2::Sftp, String> {
    // Connect to the NAS over TCP
    let tcp = TcpStream::connect(format!("{}:{}", ip, port))
        .map_err(|e| format!("TCP connect failed: {}", e))?;
    // Start SSH session
    let mut sess = Session::new().map_err(|e| format!("Session error: {}", e))?;
    sess.set_tcp_stream(tcp);
    sess.handshake().map_err(|e| format!("SSH handshake failed: {}", e))?;
    // Authenticate with username/password
    sess.userauth_password(username, password)
        .map_err(|e| format!("Auth failed: {}", e))?;
    // Open SFTP session
    let sftp = sess.sftp().map_err(|e| format!("SFTP failed: {}", e))?;
    Ok(sftp)
}

// 4. Command: List files in a remote directory
#[tauri::command]
fn list_files(
    ip: String,
    port: u16,
    username: String,
    password: String,
    remote_path: String,
) -> Result<Vec<FileInfo>, String> {
    let sftp = connect_sftp(&ip, port, &username, &password)?;
    let mut dir = sftp.opendir(Path::new(&remote_path))
        .map_err(|e| format!("Open dir failed: {}", e))?;
    let entries = dir.readdir().map_err(|e| format!("Read dir failed: {}", e))?;
    let mut files = Vec::new();
    for entry in entries {
        let (path, stat) = entry;
        let name = path.file_name()
            .and_then(|n| n.to_str())
            .map(|s| s.to_string())
            .unwrap_or_default();
        if name == "." || name == ".." { continue; }
        files.push(FileInfo {
            name,
            is_dir: stat.is_dir(),
            size: stat.size(),
        });
    }
    Ok(files)
}

#[tauri::command]
fn download_file(
    ip: String,
    port: u16,
    username: String,
    password: String,
    remote_path: String,
    local_path: String,
) -> Result<(), String> {
    let sftp = connect_sftp(&ip, port, &username, &password)?;
    let mut remote_file = sftp.open(Path::new(&remote_path))
        .map_err(|e| format!("Open remote file failed: {}", e))?;
    // Create the local file for writing
    let mut local_file = File::create(&local_path)
        .map_err(|e| format!("Create local file failed: {}", e))?;
    // Copy data from remote to local
    let mut buffer = [0u8; 8192];
    loop {
        let n = remote_file.read(&mut buffer)
            .map_err(|e| format!("Read remote file failed: {}", e))?;
        if n == 0 { break; }
        local_file.write_all(&buffer[..n])
            .map_err(|e| format!("Write local file failed: {}", e))?;
    }
    Ok(())
}

// 6. Command: Upload a local file to the NAS
#[tauri::command]
fn upload_file(
    ip: String,
    port: u16,
    username: String,
    password: String,
    local_path: String,
    remote_path: String,
) -> Result<(), String> {
    // Connect to SFTP
    let sftp = connect_sftp(&ip, port, &username, &password)?;
    // Open the local file for reading
    let mut local_file = File::open(&local_path)
        .map_err(|e| format!("Open local file failed: {}", e))?;
    // Create the remote file for writing (mode 0o644)
    let mut remote_file = sftp.create(Path::new(&remote_path))
        .map_err(|e| format!("Create remote file failed: {}", e))?;
    // Copy data from local to remote
    let mut buffer = [0u8; 8192];
    loop {
        let n = local_file.read(&mut buffer)
            .map_err(|e| format!("Read local file failed: {}", e))?;
        if n == 0 { break; }
        remote_file.write_all(&buffer[..n])
            .map_err(|e| format!("Write remote file failed: {}", e))?;
    }
    Ok(())
}

// 7. Tauri main entry point: register commands
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            list_files,
            download_file,
            upload_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}