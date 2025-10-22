````markdown
# Voting System on SUI

A decentralized voting system built on the SUI blockchain.

## Features

- Connect your wallet via **Suiet** or **Slush** extension.
- Switch to the **Testnet** network and click **Faucet** to receive SUI balance.
- Create, activate, remove, or delist proposals.
- View proposal rankings at `/rankings`.
- Check your wallet objects at `/wallets`.
- After voting, view your **Proof of Voting** as NFTs in your wallet extension.

## Development

```bash
git clone -b no_admin_cap --single-branch https://github.com/Phucpt05/Voting-system-in-SUI.git
cd frontend
pnpm install
pnpm run dev
````

Open [http://localhost:5173](http://localhost:5173) to run the app locally.

## Redeploy Smart Contract

To redeploy the voting smart contract:

1. Navigate to the contract folder:

```bash
cd ./contracts/voting_system/
```

2. Publish the contract using SUI CLI:

```bash
sui client publish
```

3. Copy the generated `package_id`, `dashboard_id`, and `admin_cap_id` (if using the `master` branch) and paste them into the corresponding constants in:

* `generators/proposals.js`
* `frontend/constants.ts`

4. Run the proposal generator script:

```bash
node generators/proposals.js
```

This will output the SUI CLI commands to create proposals. Copy and execute these commands in the terminal to create proposals on the blockchain.

```

```
