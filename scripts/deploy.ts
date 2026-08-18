import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("----------------------------------------------------");
  console.log("Starting CertificateRegistry deployment...");
  console.log("----------------------------------------------------");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy CertificateRegistry contract
  const CertificateRegistryFactory = await ethers.getContractFactory("CertificateRegistry");
  const certificateRegistry = await CertificateRegistryFactory.deploy();
  await certificateRegistry.waitForDeployment();

  const contractAddress = await certificateRegistry.getAddress();
  console.log("CertificateRegistry successfully deployed to:", contractAddress);

  // Prepare output directory for frontend and backend consumption
  const outputDir = path.join(__dirname, "..", "src", "contracts");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log("Created directory:", outputDir);
  }

  // Retrieve ABI from compiled artifacts or interface
  const artifactPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "CertificateRegistry.sol",
    "CertificateRegistry.json"
  );

  let abi: any[] = [];
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    abi = artifact.abi;
  } else {
    // Fallback using interface format
    abi = JSON.parse(CertificateRegistryFactory.interface.formatJson());
  }

  const network = await ethers.provider.getNetwork();

  const deploymentData = {
    address: contractAddress,
    network: network.name,
    chainId: Number(network.chainId),
    deployedAt: new Date().toISOString(),
    deployer: deployer.address,
    abi: abi,
  };

  const outputPath = path.join(outputDir, "CertificateRegistry.json");
  fs.writeFileSync(outputPath, JSON.stringify(deploymentData, null, 2), "utf8");
  console.log("Contract metadata and ABI written to:", outputPath);
  console.log("----------------------------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
