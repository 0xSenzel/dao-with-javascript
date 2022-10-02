import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import ethers from "ethers";

// Importing and configuring our .env file that we use to securely store our environment variables
import dotenv from "dotenv";
dotenv.config();

// Some quick checks to make sure our .env is working
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === "") {
    console.log("🛑 Private key not found.");
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === "") {
    console.log("🛑 AlchemyNode API URL not found.");
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
    console.log("🛑 Wallet address not found.");
}

// RPC URL, we'll use our AlchemyNode API URL from /env file
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const sdk = new ThirdwebSDK(wallet);

(async () => {
    try {
        const address = await sdk.getSigner().getAddress();
        console.log("SDK initialized by address:", address)
    } catch (err) {
        console.error("Failed to get apps from the sdk", err);
        process.exit(1);
    }
})();

// We are exporting the initialized thirdweb SDK so that we can use it in our other scripts
export default sdk;