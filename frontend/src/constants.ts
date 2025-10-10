// PACKAGE ID
export const TESTNET_PACKAGE_ID ="0x73fcf7f7a3219a85db9ceacbf848e6f0f0c7bfb58f5164da0e9f0f0c95c08d47";
export const DEV_PACKAGE_ID ="0x73fcf7f7a3219a85db9ceacbf848e6f0f0c7bfb58f5164da0e9f0f0c95c08d47";
export const MAINNET_PACKAGE_ID ="0x73fcf7f7a3219a85db9ceacbf848e6f0f0c7bfb58f5164da0e9f0f0c95c08d47";
// ADMINCAP
export const TESTNET_ADMIN_CAP ="0xbc8f2381b3f488cf90d405380e6214de4e11c338e516d96662ba4681dd76f51d";
export const DEVNET_ADMIN_CAP ="0xbc8f2381b3f488cf90d405380e6214de4e11c338e516d96662ba4681dd76f51d";
export const MAIN_ADMIN_CAP ="0xbc8f2381b3f488cf90d405380e6214de4e11c338e516d96662ba4681dd76f51d";
// DASHBOARD
export const TESTNET_DASHBOARD ="0xddd6bd5a85bd288ef8c6209175fa56059e0e5ddc61bfa2400189636f0a5bf42e";
export const DEVNET_DASHBOARD ="0x123123";
export const MAINNET_DASHBOARD ="0x99999";


// sui client ptb --move-call 0x772e1b197e54f32f55cb0f087c4a8119d086d5c165072abefe405f57ce8fbf80::proposal::create @0x5f312e3938bf6910935ac53d32ad272b36878e631306665a120f0b1bcd5975b5 '"Proposal 1"' '"Proposal description 1"' 1740309061 --assign proposal_id --move-call 0x772e1b197e54f32f55cb0f087c4a8119d086d5c165072abefe405f57ce8fbf80::dashboard::register_proposal @0xb36b393ba3abbe3c2ce5419d623cec395dd719d7d66ec17c982ee765581dd7a0 proposal_id  


