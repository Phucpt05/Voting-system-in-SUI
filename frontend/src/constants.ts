// PACKAGE ID
export const TESTNET_PACKAGE_ID ="0xe6f457e4cce09f7c09cf396760f78a6fd23866e1d7ef9b50414c62923a475ebf";
export const DEV_PACKAGE_ID ="0x123";
export const MAINNET_PACKAGE_ID ="0x123";
// ADMINCAP
export const TESTNET_ADMIN_CAP ="0xd9f4553b4faa8b678014bc85151cfefd3f0b7296d225417b0a1f6c98605650c3";
export const DEVNET_ADMIN_CAP ="0x123";
export const MAINNET_ADMIN_CAP ="0x133";
// DASHBOARD
export const TESTNET_DASHBOARD ="0xb430ff30026d69bd5fe6106f8486a5c635cc478867075f64aa108950dbe75cbd";
export const DEVNET_DASHBOARD ="0x123123";
export const MAINNET_DASHBOARD ="0x99999";


// sui client ptb --move-call 0x772e1b197e54f32f55cb0f087c4a8119d086d5c165072abefe405f57ce8fbf80::proposal::create @0x5f312e3938bf6910935ac53d32ad272b36878e631306665a120f0b1bcd5975b5 '"Proposal 1"' '"Proposal description 1"' 1740309061 --assign proposal_id --move-call 0x772e1b197e54f32f55cb0f087c4a8119d086d5c165072abefe405f57ce8fbf80::dashboard::register_proposal @0xb36b393ba3abbe3c2ce5419d623cec395dd719d7d66ec17c982ee765581dd7a0 proposal_id  


