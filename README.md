# Sui Voting App

A decentralized voting system built on the SUI blockchain, allowing users to create, manage, and vote on proposals using NFTs as proof of voting.

## Features

- Connect your wallet via **Suiet** or **Slush** extension.  
- Switch to **Testnet** and click **Faucet** to receive SUI balance.  
- Perform actions such as **create**, **remove**, **delist**, **activate**, and **voting proposals**. 
- View proposal rankings at `/rankings`.
- View img through blob_id (walrus)  
- Check your wallet objects at `/wallets`.  
- After voting, see **proof of voting NFTs** in your wallet extension.

## Development Setup
#### Clone the repository (no_admin_cap branch)
```bash
git clone -b no_admin_cap --single-branch https://github.com/Phucpt05/Voting-system-in-SUI.git
cd frontend
pnpm install
pnpm run dev
```
Access app at: http://localhost:5173
Navigate to the contracts folder

## To moderate smartcontract:
```bash
  cd contracts/voting_system/
```
#### Publish the smart contract
```bash
sui client publish
```
#### After publishing, copy the following IDs:
- package_id
- dashboard_id
- admin_cap_id

#### Update constants in:
- frontend/constants.ts
- generators/proposals.js

#### Initialize proposals ()
```bash
node generators/proposals.js
```
#### Copy generated SUI CLI commands and run in terminal to rapidly create proposals
