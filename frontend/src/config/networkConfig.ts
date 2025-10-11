import { createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { DEV_PACKAGE_ID, DEVNET_DASHBOARD, DEVNET_ADMIN_CAP, MAINNET_DASHBOARD, MAINNET_PACKAGE_ID, MAINNET_ADMIN_CAP, TESTNET_DASHBOARD, TESTNET_PACKAGE_ID, TESTNET_ADMIN_CAP } from "../constants";

 const {networkConfig, useNetworkVariable} =  createNetworkConfig({
    devnet:{
        url: getFullnodeUrl("devnet"),
        variables:{
            dashboardId: DEVNET_DASHBOARD,
            packageId: DEV_PACKAGE_ID,
            adminCapId: DEVNET_ADMIN_CAP
        }
    },
    testnet:{
        url: getFullnodeUrl("testnet"),
        variables:{
            dashboardId: TESTNET_DASHBOARD,
            packageId: TESTNET_PACKAGE_ID,
            adminCapId: TESTNET_ADMIN_CAP

        }
    },
    mainnet:{
        url: getFullnodeUrl("mainnet"),
        variables:{
            dashboardId: MAINNET_DASHBOARD,
            packageId: MAINNET_PACKAGE_ID,
            adminCapId: MAINNET_ADMIN_CAP

        }
    },
 });
export {networkConfig, useNetworkVariable};