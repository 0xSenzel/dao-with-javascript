import sdk from "./1-initialize-sdk.js";

// Governance contract
const vote = sdk.getVote("0x3E62046687f3A20d5D167f3aE248f652AD29aa32");

// ERC-20 contract
const token = sdk.getToken("0x76E588796f14ee43c031296e2c3DD3a6ceb3e3FE");

(async () => {
    try {
        // Give treasury power to mint additional token for when needed
        await token.roles.grant("minter", vote.getAddress());

        console.log(
            "Successfully gave vote contract permissions to act on token contract"
        );
    } catch (error) {
        console.error(
            "Failed to grant vote contract permissions on token contract",
            error
        );
        process.exit(1);
    }

    try {
        // Grab our wallet's token balance
        const ownedTokenBalance = await token.balanceOf(
            process.env.WALLET_ADDRESS
        );

        // Grab 90% of the supply that we hold
        const ownedAmount = ownedTokenBalance.displayValue;
        const percent90 = Number(ownedAmount) / 100 * 90;

        // Transfer 90% of supply to voting contract
        await token.transfer(
            vote.getAddress(),
            percent90
        );

        console.log("✅ Successfully transferred" + percent90 + "tokens to vote contract");
    } catch (err) {
        console.error("Failed to transfer tokens to vote contract", err);
    }
})();