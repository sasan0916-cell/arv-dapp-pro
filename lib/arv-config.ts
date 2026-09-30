export const ARV_CONFIG = {
  token: {
    name: 'Arvand Khabar',
    symbol: 'ARV',
    decimals: 18,
    totalSupplyTestnet: '10000000',
    totalSupplyMainnet: '100000000',
    address: '0x049C66b452f650a0d5F51536f5bC03f249C5163A' as `0x${string}`,
  },
  network: {
    name: 'BNB Smart Chain Testnet',
    chainId: 97,
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    explorer: 'https://testnet.bscscan.com',
    nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
  },
  wallets: {
    main: {
      address: '0xface68c6507ee71090ddcbbb686f86f69508ccf6' as `0x${string}`,
      share: 60,
      label: 'کیف اصلی',
    },
    reward: {
      address: '0xf912aea6031de1e6d3446e4a7a8d1166328edbe2' as `0x${string}`,
      share: 40,
      label: 'کیف پاداش',
    },
  },
  team: {
    owner: { name: 'عسل نوذری', role: 'مالک پروژه' },
    developer: { name: 'ساسان اشکش', role: 'توسعه‌دهنده' },
    marketing: { name: 'سعید نظری', role: 'بازاریابی' },
  },
  website: 'https://arvandkhabar.ir',
  links: {
    bscscanToken: 'https://testnet.bscscan.com/token/0x049C66b452f650a0d5F51536f5bC03f249C5163A',
    bscscanMainWallet: 'https://testnet.bscscan.com/address/0xface68c6507ee71090ddcbbb686f86f69508ccf6',
    bscscanRewardWallet: 'https://testnet.bscscan.com/address/0xf912aea6031de1e6d3446e4a7a8d1166328edbe2',
  },
  settings: {
    defaultLocale: 'fa',
    locales: ['fa', 'en'],
    rtl: true,
  },
} as const;

export type ARVConfig = typeof ARV_CONFIG;
