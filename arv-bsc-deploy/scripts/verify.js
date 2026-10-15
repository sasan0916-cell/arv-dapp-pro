const hre = require("hardhat");

async function main() {
  // بعد از اجرای deploy.js، آدرس چاپ‌شده "ARV deployed to: ..." را اینجا جای‌گذاری کنید
  const CONTRACT_ADDRESS = "PASTE_DEPLOYED_CONTRACT_ADDRESS_HERE";

  const MASTER_WALLET = "0xface68c6507ee71090ddcbbb686f86f69508ccf6";
  const REWARD_POOL   = "0xf912aea6031de1e6d3446e4a7a8d1166328edbe2";

  await hre.run("verify:verify", {
    address: CONTRACT_ADDRESS,
    constructorArguments: [MASTER_WALLET, REWARD_POOL],
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
