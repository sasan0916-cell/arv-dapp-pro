# ARV Super DApp — Final Production Checklist

## Implemented in source

- Independent mobile-first DApp UI
- Persian / English and RTL / LTR switching
- Official transparent ARV logo
- Internal self-custody wallet with AES-GCM + PBKDF2 encrypted storage
- Mnemonic/private-key restore
- External wallet connection via injected wallets, MetaMask, Coinbase Wallet and optional WalletConnect
- BSC Testnet / Mainnet support
- ARV Mainnet address intentionally empty until final deployment
- Automatic ARV Testnet → Mainnet switch when a valid Mainnet address is configured
- Multi-token BSC catalog including low-unit-price tokens
- Real on-chain Router quotes
- Real ERC-20 approval
- Real swaps
- Exact quoted route reused for execution
- Slippage protection
- Transaction hashes and local transaction history
- Add/remove Token-BNB liquidity on BSC Mainnet
- No simulated market prices or fake swap success states
- Real on-chain market quote page
- Real reward transfer from the encrypted reward wallet in the admin panel
- Capacitor Android packaging
- GitHub Actions APK/AAB workflow

## Required before public financial launch

1. Deploy and verify the final ARV Mainnet contract.
2. Put the verified contract address in `NEXT_PUBLIC_ARV_MAINNET_ADDRESS`.
3. Configure a WalletConnect/Reown Project ID if QR/deep-link wallets are required.
4. Configure Android signing for the release AAB.
5. Test real swaps and liquidity with small amounts on BSC Mainnet.
6. Independently audit smart contracts and production configuration.
7. If historical market analytics are required, connect a dedicated indexer/API. The DApp does not fabricate those statistics.
