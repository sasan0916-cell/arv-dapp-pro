const hre = require("hardhat");

async function main() {
  // کیف پول اصلی سایت (Master) — همان آدرسی که در پنل "کیف پول اصلی سایت ARV" استفاده می‌شود
  const MASTER_WALLET = "0xface68c6507ee71090ddcbbb686f86f69508ccf6";
  // کیف پول استخر پاداش (Reward Pool) — همان آدرسی که در پنل "کیف پول استخر پاداش ARV" استفاده می‌شود
  const REWARD_POOL   = "0xf912aea6031de1e6d3446e4a7a8d1166328edbe2";

  console.log("در حال دیپلوی روی شبکه:", hre.network.name);
  console.log("Master Wallet:", MASTER_WALLET);
  console.log("Reward Pool:  ", REWARD_POOL);

  const ARV = await hre.ethers.getContractFactory("ARVToken");
  const arv = await ARV.deploy(MASTER_WALLET, REWARD_POOL);
  await arv.waitForDeployment();

  const address = await arv.getAddress();
  console.log("\n✅ ARV deployed to:", address);
  console.log("این آدرس را در تنظیمات افزونه (ARV Token → Settings) به‌عنوان قرارداد شبکه فعال وارد کنید.");
}

main().catch((e) => { console.error(e); process.exit(1); });
