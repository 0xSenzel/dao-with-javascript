import sdk from "./1-initialize-sdk.js";

// Address to our ERC-1155 membership NFT contract
const editionDrop = sdk.getEditionDrop("0xc97a2d64251abb84D7A0fA57988b4E0CA4D5Bc51");

// Address to our ERC-20 token contract
const token = sdk.getToken("0x76E588796f14ee43c031296e2c3DD3a6ceb3e3FE");

(async () => {
    try {
        // Grab all the addressed of people who own our membership NFT
        // which has a tokenID of 0
        const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);

        if(walletAddresses.length === 0) {
            console.log(
                "No NFTs have been claimed yet, maybe get some friends to claim your free NFTs!",
            );
            process.exit(0);
        }
        const airdropTargets = walletAddresses.map((address) => {
            // Pick a random # between 1000 and 10000
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            console.log("✅ Going to airdrop", randomAmount, "tokens to", address);

            // Set up the target
            const airdropTargets = {
                toAddress: address,
                amount: randomAmount,
            };

            return airdropTargets;
        });

        // Call transferBatch on all our airdrop targets
        console.log("🌈 Starting airdrop...");
        await token.transferBatch(airdropTargets);
        console.log("✅ Successfully airdropped tokens to all the holders of the NFT!");
    } catch (err) {
        console.error("Failed to airdrop tokens", err);
    }
})();