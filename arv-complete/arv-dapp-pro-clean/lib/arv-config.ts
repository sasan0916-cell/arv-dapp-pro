const TESTNET_ARV_ADDRESS = '0x049C66b452f650a0d5F51536f5bC03f249C5163A' as `0x${string}`;

// Mainnet is activated automatically as soon as a valid ARV mainnet contract
// address is supplied through NEXT_PUBLIC_ARV_MAINNET_ADDRESS. Until then the
// DApp safely remains on BSC Testnet for ARV.
const configuredMainnetAddress = (process.env.NEXT_PUBLIC_ARV_MAINNET_ADDRESS || '').trim();
const isValidEvmAddress = /^0x[a-fA-F0-9]{40}$/.test(configuredMainnetAddress);
const MAINNET_ARV_ADDRESS = (isValidEvmAddress ? configuredMainnetAddress : '') as `0x${string}` | '';
const ARV_MAINNET_ACTIVE = Boolean(MAINNET_ARV_ADDRESS);

const TESTNET_NETWORK = {
  name: 'BNB Smart Chain Testnet',
  nameShort: 'BSC Testnet',
  chainId: 97,
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  explorer: 'https://testnet.bscscan.com',
  nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
  status: 'active' as const,
  address: TESTNET_ARV_ADDRESS,
};

const MAINNET_NETWORK = {
  name: 'BNB Smart Chain Mainnet',
  nameShort: 'BSC Mainnet',
  chainId: 56,
  rpcUrl: 'https://bsc-dataseed.binance.org/',
  explorer: 'https://bscscan.com',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  status: 'active' as const,
  address: MAINNET_ARV_ADDRESS,
};

const ACTIVE_NETWORK = ARV_MAINNET_ACTIVE ? MAINNET_NETWORK : TESTNET_NETWORK;
const ACTIVE_ARV_ADDRESS = ACTIVE_NETWORK.address;

export const ARV_CONFIG = {
  admin: { biometricRequired: true },
  token: {
    name: 'Arvand Khabar Token',
    nameShort: 'Arvand Khabar',
    tagline: 'ARV • Arvand Khabar Token',
    symbol: 'ARV',
    decimals: 18,
    totalSupplyTestnet: '10000000',
    totalSupplyMainnet: '100000000',
    // Always points to the currently active ARV contract.
    address: ACTIVE_ARV_ADDRESS,
    testnetAddress: TESTNET_ARV_ADDRESS,
    mainnetAddress: MAINNET_ARV_ADDRESS,
    standard: 'BEP-20',
  },
  networks: {
    testnet: TESTNET_NETWORK,
    mainnet: {
      ...MAINNET_NETWORK,
      status: ARV_MAINNET_ACTIVE ? ('active' as const) : ('pending' as const),
      deployedAt: null,
      auditUrl: '',
    },
  },
  network: ACTIVE_NETWORK,
  mode: ARV_MAINNET_ACTIVE ? ('mainnet' as const) : ('testnet' as const),
  mainnetReady: ARV_MAINNET_ACTIVE,
  wallets: {
    main: {
      address: '0xface68c6507ee71090ddcbbb686f86f69508ccf6' as `0x${string}`,
      share: 60,
      amount: '6000000',
      label: 'کیف اصلی',
      labelEn: 'Main Wallet',
    },
    reward: {
      address: '0xf912aea6031de1e6d3446e4a7a8d1166328edbe2' as `0x${string}`,
      share: 40,
      amount: '4000000',
      label: 'کیف پاداش',
      labelEn: 'Reward Wallet',
    },
  },
  team: {
    owner: { name: 'عسل نوذری', role: 'مالک پروژه', roleEn: 'Owner' },
    developer: { name: 'ساسان اشکش', role: 'توسعه‌دهنده', roleEn: 'Developer' },
    marketing: { name: 'سعید نظری', role: 'بازاریابی', roleEn: 'Marketing' },
  },
  domains: {
    main: 'https://arvtoken.ir',
    dapp: 'https://arvtoken.ir',
    docs: 'https://arvtoken.ir',
    news: 'https://arvandkhabar.ir',
    api: 'https://api.arvtoken.com',
  },
  social: {
    twitter: 'https://twitter.com/arvtoken',
    telegram: 'https://t.me/arvtoken',
    github: 'https://github.com/sasan0916-cell/arv-dapp-pro',
    website: 'https://arvandkhabar.ir',
  },
  links: {
    bscscanToken: ACTIVE_ARV_ADDRESS ? `${ACTIVE_NETWORK.explorer}/token/${ACTIVE_ARV_ADDRESS}` : '',
    bscscanMainWallet: `${ACTIVE_NETWORK.explorer}/address/0xface68c6507ee71090ddcbbb686f86f69508ccf6`,
    bscscanRewardWallet: `${ACTIVE_NETWORK.explorer}/address/0xf912aea6031de1e6d3446e4a7a8d1166328edbe2`,
  },
  steps: [
    { num: 1, title: 'فعالیت در اروند خبر', desc: 'در سایت خبری اروند خبر فعالیت کنید' },
    { num: 2, title: 'جمع‌آوری امتیاز', desc: 'امتیازهای شما در حساب کاربری سایت ثبت می‌شود' },
    { num: 3, title: 'تبدیل به ARV', desc: 'طبق قوانین تبدیل امتیازات به توکن ARV' },
    { num: 4, title: 'مدیریت در کیف پول', desc: 'کیف پول مستقل ARV را بسازید' },
  ],
  settings: {
    defaultLocale: 'fa',
    locales: ['fa', 'en'],
    rtl: true,
  },
} as const;

export type ARVConfig = typeof ARV_CONFIG;
