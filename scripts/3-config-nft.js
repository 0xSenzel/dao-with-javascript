import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

// Access editionDrop contract through editionDropAddress
const editionDrop = await sdk.getEditionDrop("0xc97a2d64251abb84D7A0fA57988b4E0CA4D5Bc51");

(async () => {
    try {
        await editionDrop.createBatch([
            {
                name: "Protector Symbol",
                description: "This NFT will give you access to SecureDAO",
                image: readFileSync("scripts/assets/symbol.png")
            },
        ]);
        console.log("✅ Successfully created a new NFT in the drop!");
    } catch (error) {
        console.error("failed to create the new NFT", error);
    }
})();