# Web3 NFT Gallery & Notes

A minimal, no-framework Web3 NFT Gallery that allows you to view your Polygon NFTs and store personal notes on-chain.

## Prerequisites
1. **MetaMask Wallet** installed in your browser.
2. **Polygon Amoy Testnet** added to MetaMask.
3. **Alchemy API Key** for Polygon Amoy.

## Setup Instructions

### 1. Smart Contract Deployment
You need to deploy the `NFTGalleryNotes.sol` contract to the Polygon Amoy Testnet.
You can use [Remix IDE](https://remix.ethereum.org/) for this:
1. Go to Remix.
2. Create a new file and paste the content of `NFTGalleryNotes.sol`.
3. Compile the contract (Solver: 0.8.x).
4. Go to the "Deploy & Run" tab.
5. Select "Injected Provider - MetaMask" as the environment.
6. Deploy `NFTGalleryNotes`.
7. **Copy the Deployed Contract Address**.

### 2. Configure the Frontend
1. Open `script.js` in a text editor.
2. Find the line:
   ```javascript
   const ALCHEMY_API_KEY = "YOUR_ALCHEMY_API_KEY";
   ```
   Replace `"YOUR_ALCHEMY_API_KEY"` with your actual Alchemy API Key.
3. Find the line:
   ```javascript
   const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
   ```
   Replace `"YOUR_DEPLOYED_CONTRACT_ADDRESS"` with the address you copied from Remix.

### 3. Run the App
Simply open `index.html` in your browser!
- **Connect Wallet**: Click the top right button.
- **Fetch NFTs**: The app will auto-fill your address. Click "Fetch NFTs".
- **Add Notes**: Click on any NFT to open the modal and save a note on-chain.

## Features
- **View NFTs**: Fetches all NFTs owned by the connected wallet on Polygon Amoy.
- **On-Chain Notes**: Save notes directly to the blockchain for any NFT.
- **Clean UI**: Dark mode, responsive grid, and smooth interactions.

## Troubleshooting
- **No NFTs showing?** Make sure you have NFTs on the Amoy Testnet and your Alchemy API key is valid.
- **Transaction fails?** Ensure you have enough Amoy MATIC for gas fees.
