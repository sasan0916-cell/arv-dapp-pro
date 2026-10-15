const hre = require("hardhat");

async function main() {
  // بعد از اجرای deploy.js، آدرس چاپ‌شده "ARV deployed to: ..." را اینجا جای‌گذاری کنید
  const CONTRACT_ADDRESS = "PASTE_DEPLOYED_CONTRACT_ADDRESS_HERE";

  const arv = await hre.ethers.getContractAt("ARVToken", CONTRACT_ADDRESS);

  console.log("Name:", await arv.name());
  console.log("Symbol:", await arv.symbol());
  console.log("Decimals:", await arv.decimals());
  console.log("Version:", await arv.version());
  console.log("Total Supply:", (await arv.totalSupply()).toString());
  console.log("Master Wallet:", await arv.masterWallet());
  console.log("Reward Pool:", await arv.rewardPoolWallet());
  console.log("Master Balance:", (await arv.balanceOf(await arv.masterWallet())).toString());
  console.log("Reward Balance:", (await arv.balanceOf(await arv.rewardPoolWallet())).toString());

  // بررسی سریع: مجموع دو موجودی باید دقیقاً برابر Total Supply باشد
  const total = await arv.totalSupply();
  const m = await arv.balanceOf(await arv.masterWallet());
  const r = await arv.balanceOf(await arv.rewardPoolWallet());
  console.log("\nSum check (m + r == total):", (m + r).toString() === total.toString() ? "OK ✅" : "MISMATCH ❌");
}

main().catch((e) => { console.error(e); process.exit(1); });
