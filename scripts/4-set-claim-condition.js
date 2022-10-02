import sdk from "./1-initialize-sdk.js";
import { MaxInt256 } from "@ethersproject/constants";

const editionDrop = await sdk.getEditionDrop("0xc97a2d64251abb84D7A0fA57988b4E0CA4D5Bc51");

(async () => {
    try {
        // We define our claim conditions, this is an array of objects because
        // we can have multiple phases starting at different time if we want
        const claimConditions =[{
            // When people are gonna be able to start claiming the NFTs (now)
            startTime: new Date(),
            // Maximum number of NFTs that can be claimed
            maxQuantity: 50_000,
            // Price of our NFT (free)
            price: 0,
            // The amount of NFTs people can claim in one transaction
            quantityLimitPerTransaction: 1,
            // We set the wait between transactions to MAXUint256, which means
            // people are only allowed to claim once
            waitInSeconds: MaxInt256,
        }]

        // tokenId 0
        await editionDrop.claimConditions.set("0", claimConditions);
        console.log("✅ Successfully set claim condition!");
    } catch (error) {
        console.error("Failed to set claim condition", error);
    }
})();