import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

// Governance contract
const vote = sdk.getVote("0x3E62046687f3A20d5D167f3aE248f652AD29aa32");

// ERC-20 contract
const token = sdk.getToken("0x76E588796f14ee43c031296e2c3DD3a6ceb3e3FE");

(async () => {
    try {
        // Create proposal to mint 420,000 new token to the treasury
        const amount = 420_000;
        const description = "Should the DAO mint an additional " + amount + " tokens into the treasury?";
        const executions = [
            {
                // Token contracts that actually executes the mint
                toAddress: token.getAddress(),

                // nativeToken (ETH) we want to send in this proposal.
                // In this case, we're just minting to treasury so we set it to 0
                nativeTokenValue: 0,

                // Use ethers.js to convert the amount
                // to the correct format as they are in wei
                transactionData: token.encoder.encode(
                    "mintTo", [
                        vote.getAddress(),
                        ethers.utils.parseUnits(amount.toString(), 18),
                    ]
                ),
            }
        ];

        await vote.propose(description, executions);

        console.log("✅ Successfully created proposal to mint tokens");
    } catch (error) {
        console.error("failed to create first proposal", error);
        process.exit(1);
    }

    try {
        // Create proposal to transfer ourselves 6,900 tokens for being awesome
        const amount = 6_900;
        const description = "Should the DAO transfer " + amount + " tokens from the treasury to " + process.env.WALLET_ADDRESS + " for being awesome? ";
        const executions = [
            {
                // Sending ourselves 0 ETH, just the DAO token
                nativeTokenValue: 0,
                transactionData: token.encoder.encode(
                    // Doing a transfer from the treasury to our wallet
                    "transfer",
                    [
                        process.env.WALLET_ADDRESS,
                        ethers.utils.parseUnits(amount.toString(), 18),
                    ]
                ),
                toAddress: token.getAddress(),
            },
        ];

        await vote.propose(description, executions);

        console.log(
            "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
        );
    } catch (error) {
        console.error("failed to create second proposal", error);
    }
})();