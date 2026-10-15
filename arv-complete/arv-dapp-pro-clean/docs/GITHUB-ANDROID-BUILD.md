# ARV Super DApp — Android Build

## One-click GitHub build

1. Create a GitHub repository and upload this project.
2. Open **Actions** → **Build ARV Super DApp Android** → **Run workflow**.
3. After the job finishes, open the workflow run and download the artifact **ARV-Super-DApp-Android**.
4. `app-debug.apk` is directly installable on Android phones.
5. `app-release.aab` is the release bundle output; Google Play publication requires signing.

## Optional GitHub Secrets

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Reown/WalletConnect project ID for QR/deep-link wallet connections.
- `NEXT_PUBLIC_ARV_MAINNET_ADDRESS`: leave empty until the final ARV Mainnet contract is deployed. Once populated with the final `0x...` address, the DApp activates ARV Mainnet automatically.

## App identity

- App name: **ARV Super DApp**
- Android application ID: `ir.arvandkhabar.arvsuperdapp`
- Official logo: `public/arv-logo.png`
