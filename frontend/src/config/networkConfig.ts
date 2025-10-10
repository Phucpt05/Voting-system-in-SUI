import { createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { DEV_PACKAGE_ID, DEVNET_DASHBOARD, MAINNET_DASHBOARD, MAINNET_PACKAGE_ID, TESTNET_DASHBOARD, TESTNET_PACKAGE_ID } from "../constants";

 const {networkConfig, useNetworkVariable} =  createNetworkConfig({
    devnet:{
        url: getFullnodeUrl("devnet"),
        variables:{
            dashboardId: DEVNET_DASHBOARD,
            packageId: DEV_PACKAGE_ID
        }
    },
    testnet:{
        url: getFullnodeUrl("testnet"),
        variables:{
            dashboardId: TESTNET_DASHBOARD,
            packageId: TESTNET_PACKAGE_ID

        }        
    },
    mainnet:{
        url: getFullnodeUrl("mainnet"),
        variables:{
            dashboardId: MAINNET_DASHBOARD,
            packageId: MAINNET_PACKAGE_ID

        }        
    },
 });
export {networkConfig, useNetworkVariable};