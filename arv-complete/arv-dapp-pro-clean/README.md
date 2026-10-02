# ARV Super DApp — Multi-Token DEX

ARV Super DApp is a mobile-first Web3 DApp for BNB Smart Chain. It combines an independent self-custody wallet, external-wallet connectivity, multi-token swaps and BSC liquidity management.

## Included

- BSC Testnet and BSC Mainnet support (Chain ID 97 / 56)
- ARV Testnet contract with automatic Mainnet activation by one environment variable
- Multi-token Swap using PancakeSwap V2 router quotes and the exact quoted route
- Direct, WBNB and stablecoin-assisted quote paths where on-chain liquidity exists
- Real ERC-20 approvals and on-chain swaps — no simulated success states
- MetaMask, Coinbase, injected wallets and WalletConnect QR/deep-link connectivity
- Encrypted internal wallet storage using AES-GCM with PBKDF2-SHA256
- Add and remove BSC Mainnet Token/BNB liquidity
- Local transaction receipt history plus optional BscScan history
- Persian / English interface with RTL/LTR switching
- PWA and Capacitor Android packaging
- GitHub Actions workflow producing an installable debug APK and release AAB artifact

## ARV Mainnet switch

`NEXT_PUBLIC_ARV_MAINNET_ADDRESS` is intentionally empty in the repository. When the final ARV BEP-20 Mainnet contract is deployed, put its address into that variable. A valid address automatically switches ARV from BSC Testnet to BSC Mainnet without changing source code.

## External wallets

External wallets remain non-custodial. The DApp never asks for or stores their private keys. Transactions are approved and signed in the user's wallet.

For WalletConnect QR/deep-link support, configure `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in GitHub Actions secrets. Injected wallet browsers can work without it.

## Android build

GitHub Actions:

1. Push the repository to GitHub.
2. Add optional secrets:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_ARV_MAINNET_ADDRESS` (leave unset until Mainnet deployment)
   - `NEXT_PUBLIC_BSCSCAN_API_KEY` (optional)
3. Run **Actions → Build ARV Super DApp Android**.
4. Download the `ARV-Super-DApp-Android` artifact.

The workflow creates the Capacitor Android project, builds the web bundle, syncs Android, and produces:

- `app-debug.apk` — installable test APK
- `app-release.aab` — release bundle artifact (unsigned unless Android signing is configured)

## Security notes

The internal wallet is encrypted at rest in browser storage and is decrypted only in memory when the user explicitly unlocks it for a transaction. External-wallet private keys never enter the DApp. Before public financial deployment, the smart contracts and production configuration should still receive an independent security audit and real-device transaction testing.
