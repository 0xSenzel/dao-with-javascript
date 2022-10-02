import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
    try {
        const editionDropAddress = await sdk.deployer.deployEditionDrop({
            // The collection's name
            name: "The SecureDAO",
            // Description for the collection
            description: "A DAO for always thriving to build a secure WEB3",
            // The image that will be held on our NFT
            image: readFileSync("scripts/assets/astro-boy.jpg"),
            // We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the contract.
            // We're planning on not charging people for the drop, so we'll pass in the 0x0 address
            // you can set this to your own wallet address if you want to charge for the drop
            primary_sale_recipient: AddressZero,
        });

        // this initialization returns the address of our contract
        // we use this to initialize the contract on the thirdweb sdk
        const editionDrop = await sdk.getEditionDrop(editionDropAddress);

        // with this, we can get the metadata of our contract
        const metadata = await editionDrop.metadata.get();

        console.log(
            "✅ Successfully deployed editionDrop contract, address:",
            editionDropAddress
        ); // Deployed to 0xc97a2d64251abb84D7A0fA57988b4E0CA4D5Bc51
        console.log("✅ editionDrop metadata:", metadata);
    } catch (error) {
        console.log("failed to deploy editionDrop contract", error);
    }
})();