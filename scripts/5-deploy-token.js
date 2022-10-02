import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

(async () => {
    try{
        //Deploy a standard ERC-20 contract
        const tokenAddress = await sdk.deployer.deployToken({
            name: "SecureDAO Governance Token",
            symbol: "SEC",
            // In case we want to sell
            // because we don't, we set it to AddressZero again
            primary_sale_recipient: AddressZero,
        });
        console.log(
            "✅ Successfully deployed token module, address:",
            tokenAddress,
        ); // 0x76E588796f14ee43c031296e2c3DD3a6ceb3e3FE
    } catch (error) {
        console.error("failed to deploy token module", error);
    }
})();