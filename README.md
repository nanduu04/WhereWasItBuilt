# WhereWasItBuilt 🔍

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/aadjploeiolcmeamlainhldaaodpgpcl?label=Chrome%20Web%20Store)](https://chromewebstore.google.com/detail/aadjploeiolcmeamlainhldaaodpgpcl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A Chrome extension that automatically detects and displays which platform a website is built on. Instantly see what platform any website is built on—WordPress, React, Shopify, and more. No clicks required!

## ✨ Features

- Real-time platform detection for any website
- Visual indicator through extension icon
- Supports major web platforms and frameworks
- Works on all websites
- Lightweight and fast detection (13.26KiB)
- No data collection or tracking
- Zero configuration required

## 🔒 Privacy

This extension:
- Does not collect or use your data
- Does not sell data to third parties
- Does not use data for purposes unrelated to core functionality
- Does not use data for creditworthiness or lending purposes

## 🏗️ Project Structure

```
WhereWasItBuilt/
├── src/
│   ├── background/     # Background service worker
│   ├── content/        # Content scripts
│   ├── popup/          # Extension popup UI
│   └── utils/          # Shared utilities
├── dist/               # Built extension files
└── manifest.json       # Extension configuration
```

## 🏛️ Architecture

The extension consists of three main components:

1. **Content Script** (`content.js`)
   - Runs on every webpage
   - Detects the platform using various heuristics
   - Sends results to background script

2. **Background Script** (`background.js`)
   - Manages extension state
   - Updates extension icon based on detected platform
   - Handles tab events and cleanup

3. **Popup UI** (`popup.html`)
   - Displays detected platform information
   - Shows confidence level of detection

## 🚀 Quick Start

1. Install from Chrome Web Store:
   - [Add to Chrome](https://chromewebstore.google.com/detail/aadjploeiolcmeamlainhldaaodpgpcl)

Or build from source:

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/WhereWasItBuilt.git
   cd WhereWasItBuilt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory

## 🛠️ Development

```bash
npm run build    # Production build
npm run dev      # Development build with watch mode
npm test        # Run all tests
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Inspired by the need to quickly identify website technologies

## 📫 Contact

- Developer: nandupokhrel
- Email: nandupokhrel@gmail.com

If you have any questions or suggestions, feel free to:
- Open an issue
- Create a pull request
- Contact the maintainers

## ⭐ Show your support

Give a ⭐️ if this project helped you! 