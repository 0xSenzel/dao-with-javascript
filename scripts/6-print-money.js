import sdk from "./1-initialize-sdk.js";

// Address of our ERC-20 contract
const token = sdk.getToken("0x76E588796f14ee43c031296e2c3DD3a6ceb3e3FE");

(async () => {
    try {
        // Max supply
        const amount = 1_000_000;
        // Interact with your deployed ERC-20 contract and mint tokens
        await token.mintToSelf(amount);
        const totalSupply = await token.totalSupply();

        // Print out how many of our token's are out there now
        console.log("✅ There now is", totalSupply.displayValue, "$SEC in circulation");
    } catch (error) {
        console.error("Failed to print money", error);
    }
})();