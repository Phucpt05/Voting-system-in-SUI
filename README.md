# Sui Voting App

A decentralized voting system built on the SUI blockchain, allowing users to create, manage, and vote on proposals using NFTs as proof of voting.

## Features

- Connect your wallet via **Suiet** or **Slush** extension.  
- Switch to **Testnet** and click **Faucet** to receive SUI balance.  
- Perform actions such as **create**, **delist**, **activate**, and **remove proposals**.  
- View proposal rankings at `/rankings`.  
- Check your wallet objects at `/wallets`.  
- After voting, see **proof of voting NFTs** in your wallet extension.

## Development Setup

```bash
# Clone the repository (no_admin_cap branch)
git clone -b no_admin_cap --single-branch https://github.com/Phucpt05/Voting-system-in-SUI.git

cd frontend
pnpm install
pnpm run dev
# Access app at: http://localhost:5173
# Navigate to the contracts folder
cd contracts/voting_system/

# Publish the smart contract
sui client publish

# After publishing, copy the following IDs (if on master branch):
# - package_id
# - dashboard_id
# - admin_cap_id

# Update constants in:
# - frontend/constants.ts
# - generators/proposals.js

# Initialize proposals
node generators/proposals.js
# Copy generated SUI CLI commands and run in terminal to create proposals
