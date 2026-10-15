const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("========================================");
  console.log("ARV DEX Deploy");
  console.log("========================================");
  console.log("Network:", network);
  console.log("Deployer:", deployer.address);
  console.log("Balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
  console.log("========================================\n");

  const WBNB = network === "bsc"
    ? "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
    : "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";

  console.log("Deploying ARVFactory...");
  const Factory = await hre.ethers.getContractFactory("ARVFactory");
  const factory = await Factory.deploy(deployer.address);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log("OK ARVFactory:", factoryAddress);

  console.log("\nDeploying ARVRouter...");
  const Router = await hre.ethers.getContractFactory("ARVRouter");
  const router = await Router.deploy(factoryAddress, WBNB);
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();
  console.log("OK ARVRouter:", routerAddress);

  const ARV_TOKEN = "0x049C66b452f650a0d5F51536f5bC03f249C5163A";
  console.log("\nOK ARV Token:", ARV_TOKEN);

  console.log("\n========================================");
  console.log("SUMMARY");
  console.log("========================================");
  console.log("ARVFactory:   ", factoryAddress);
  console.log("ARVRouter:    ", routerAddress);
  console.log("ARV Token:    ", ARV_TOKEN);
  console.log("WBNB:         ", WBNB);
  console.log("Network:      ", network);
  console.log("========================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
