import { createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { DEVNET_DASHBOARD, MAINNET_DASHBOARD, TESTNET_DASHBOARD } from "../constants";

 const {networkConfig, useNetworkVariable} =  createNetworkConfig({
    devnet:{
        url: getFullnodeUrl("devnet"),
        variables:{
            dashboardId: DEVNET_DASHBOARD
        }
    },
    testnet:{
        url: getFullnodeUrl("testnet"),
        variables:{
            dashboardId: TESTNET_DASHBOARD
        }        
    },
    mainnet:{
        url: getFullnodeUrl("mainnet"),
        variables:{
            dashboardId: MAINNET_DASHBOARD
        }        
    },
 });
export {networkConfig, useNetworkVariable};