const { ethers } = require("ethers");

async function main() {
  // کیف پاداش (فرستنده)
  const FROM_MNEMONIC = "grain job afford age column crowd panic clump pumpkin coin uniform junior";
  const fromWallet = ethers.Wallet.fromPhrase(FROM_MNEMONIC);

  // کیف کاربر (گیرنده)
  const TO_ADDRESS = "0x9FdE8B3EcbCdEe25159e2BbBee8D65dA714dcbC4";

  // RPC
  const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");
  const wallet = fromWallet.connect(provider);

  console.log("========================================");
  console.log("ARV Transfer");
  console.log("========================================");
  console.log("From:", fromWallet.address);
  console.log("To:  ", TO_ADDRESS);
  console.log("========================================\n");

  // آدرس‌ها
  const ARV_ADDRESS = "0x049C66b452f650a0d5F51536f5bC03f249C5163A";

  // ABI توکن
  const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address,uint256) returns (bool)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
  ];

  const arv = new ethers.Contract(ARV_ADDRESS, ERC20_ABI, wallet);

  // موجودی
  const arvBalance = await arv.balanceOf(fromWallet.address);
  const bnbBalance = await provider.getBalance(fromWallet.address);

  console.log("ARV Balance:", ethers.formatUnits(arvBalance, 18), "ARV");
  console.log("BNB Balance:", ethers.formatEther(bnbBalance), "tBNB");
  console.log("");

  // انتقال ARV (منهای ۱٪ برای کارمزد احتمالی)
  const arvToSend = arvBalance * 99n / 100n;
  console.log("Sending", ethers.formatUnits(arvToSend, 18), "ARV...");
  const tx1 = await arv.transfer(TO_ADDRESS, arvToSend);
  console.log("TX1:", tx1.hash);
  await tx1.wait();
  console.log("OK ARV transferred\n");

  // انتقال BNB (منهای 0.01 برای کارمزد)
  const bnbBalance2 = await provider.getBalance(fromWallet.address);
  const feeReserve = ethers.parseEther("0.01");
  const bnbToSend = bnbBalance2 - feeReserve;

  if (bnbToSend > 0n) {
    console.log("Sending", ethers.formatEther(bnbToSend), "tBNB...");
    const tx2 = await wallet.sendTransaction({
      to: TO_ADDRESS,
      value: bnbToSend,
    });
    console.log("TX2:", tx2.hash);
    await tx2.wait();
    console.log("OK BNB transferred\n");
  } else {
    console.log("Not enough BNB to send\n");
  }

  console.log("========================================");
  console.log("DONE");
  console.log("========================================");
  console.log("New ARV balance in:", TO_ADDRESS);
  const newBalance = await arv.balanceOf(TO_ADDRESS);
  console.log(ethers.formatUnits(newBalance, 18), "ARV");
}

main().catch((e) => {
  console.error("Error:", e.message || e);
  process.exit(1);
});
