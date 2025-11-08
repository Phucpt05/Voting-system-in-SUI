// PACKAGE ID
export const TESTNET_PACKAGE_ID ="0x23967e1d9d0be10cec5148506cb378caf14a638177c1176e28effee27b0694f6";
export const DEV_PACKAGE_ID ="0x123";
export const MAINNET_PACKAGE_ID ="0x123";
// ADMINCAP
export const TESTNET_ADMIN_CAP ="0x3c0c4a7296e55f951e7431348421f2cf3056c2ad3053c4a63a7dbcac4f149a00";
export const DEVNET_ADMIN_CAP ="0x123";
export const MAINNET_ADMIN_CAP ="0x133";
// DASHBOARD
export const TESTNET_DASHBOARD ="0xe491203dd967078c122e1ab82e5071482718d3935a3def3f1cf5b4ab17030e61";
export const DEVNET_DASHBOARD ="0x123123";
export const MAINNET_DASHBOARD ="0x99999";

export const PUBLISHER_ID ="0xc437c89a425d9f39d186ee0794929ed46068b07a4c968e8b572d06dec2b7d755";

export const AGGREGATOR=`https://aggregator.walrus-testnet.walrus.space`
export const PUBLISHER=`https://publisher.walrus-testnet.walrus.space`



// sui client ptb --move-call 0x772e1b197e54f32f55cb0f087c4a8119d086d5c165072abefe405f57ce8fbf80::proposal::create @0x5f312e3938bf6910935ac53d32ad272b36878e631306665a120f0b1bcd5975b5 '"Proposal 1"' '"Proposal description 1"' 1740309061 --assign proposal_id --move-call 0x772e1b197e54f32f55cb0f087c4a8119d086d5c165072abefe405f57ce8fbf80::dashboard::register_proposal @0xb36b393ba3abbe3c2ce5419d623cec395dd719d7d66ec17c982ee765581dd7a0 proposal_id  


