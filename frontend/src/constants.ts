// PACKAGE ID
export const TESTNET_PACKAGE_ID ="0x7caae6c44345c4b21300730f7e298b70c487f6c6874de085d4081f66c69156e2";
export const DEV_PACKAGE_ID ="0x123";
export const MAINNET_PACKAGE_ID ="0x123";
// ADMINCAP
export const TESTNET_ADMIN_CAP ="0xee24e1565d80bebadcaefc3e9eed24179d4faa83ed2a6e5c76deb9f4f3983f07";
export const DEVNET_ADMIN_CAP ="0x123";
export const MAINNET_ADMIN_CAP ="0x133";
// DASHBOARD
export const TESTNET_DASHBOARD ="0xff3bc732ae5c5a8cececfcdf6023a7d1a69b67348f9abc72cd903b35b03d784e";
export const DEVNET_DASHBOARD ="0x123123";
export const MAINNET_DASHBOARD ="0x99999";


// sui client ptb --move-call 0x772e1b197e54f32f55cb0f087c4a8119d086d5c165072abefe405f57ce8fbf80::proposal::create @0x5f312e3938bf6910935ac53d32ad272b36878e631306665a120f0b1bcd5975b5 '"Proposal 1"' '"Proposal description 1"' 1740309061 --assign proposal_id --move-call 0x772e1b197e54f32f55cb0f087c4a8119d086d5c165072abefe405f57ce8fbf80::dashboard::register_proposal @0xb36b393ba3abbe3c2ce5419d623cec395dd719d7d66ec17c982ee765581dd7a0 proposal_id  


