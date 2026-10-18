const solc = require('solc');
const fs = require('fs');
const { ethers } = require('ethers');

async function main() {
  // ۱. کامپایل کردن قرارداد
  const source = fs.readFileSync('contracts/ARVReferral.sol', 'utf8');
  const input = {
    language: 'Solidity',
    sources: { 'ARVReferral.sol': { content: source } },
    settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } }
  };
  
  const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
  if (compiled.errors) {
    const errs = compiled.errors.filter(e => e.severity === 'error');
    if (errs.length > 0) {
      console.error("❌ خطا در کامپایل:", errs);
      process.exit(1);
    }
  }
  
  const contract = compiled.contracts['ARVReferral.sol']['ARVReferral'];
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;
  console.log("✅ قرارداد با موفقیت کامپایل شد.");

  // ۲. اتصال به شبکه و دیپلوی
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("❌ لطفاً ابتدا PRIVATE_KEY را تنظیم کنید.");
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.bnbchain.org:8545');
  const wallet = new ethers.Wallet(privateKey, provider);
  
  console.log(`📡 در حال دیپلوی از آدرس: ${wallet.address}`);
  console.log("⏳ لطفاً صبر کنید...");

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contractDeployed = await factory.deploy();
  
  await contractDeployed.waitForDeployment();
  const address = await contractDeployed.getAddress();
  
  console.log(`\n🎉 قرارداد با موفقیت دیپلوی شد!`);
  console.log(`📍 آدرس قرارداد (این را کپی کنید):`);
  console.log(`\x1b[32m${address}\x1b[0m`);
}

main().catch(console.error);
