# NAS Storage App

A cross-platform desktop application built with **React** and **Tauri** to access and manage your NAS (Network Attached Storage) files with ease.

## Features

- Browse, upload, download, and manage files on your NAS
- Fast and lightweight desktop experience
- Secure authentication to your NAS
- Cross-platform support (Windows, macOS, Linux)
- Modern UI built with React

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) or [npm](https://www.npmjs.com/)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites/)

### Installation

```bash
git clone https://github.com/your-username/nas-storage-app.git
cd nas-storage-app
pnpm install
```

### Development

```bash
pnpm tauri dev
```

### Build

```bash
pnpm tauri build
```

## Configuration

Update the NAS connection settings in the app's configuration file or UI.

## Folder Structure

```
src/
    ├── components/
    ├── pages/
    ├── tauri/         # Rust backend
    └── ...
```

## Security

- All NAS credentials are stored securely.
- Communication with NAS uses encrypted protocols (e.g., SMB over TLS, SFTP).

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

## License

[MIT](LICENSE)

---

Built with [React](https://react.dev/) & [Tauri](https://tauri.app/)