import sdk from "./1-initialize-sdk.js";

(async () => {
    try {
        const voteContractAddress = await sdk.deployer.deployVote({
            // Governance contract's name
            name: "The executive board",
            // Governance token, our ERC-20 contract
            voting_token_address: "0x76E588796f14ee43c031296e2c3DD3a6ceb3e3FE",

            /*
            These parameters are specified in number of blocks
            Assuming block time of around 13.14 seconds (for Ethereum)
            */

            // After a proposal is created, time of when members can start voting
            // Set as immediately
            voting_delay_in_blocks: 0,

            // Time for members have to vote on a proposal when it's created
            // Set to 1 day = 6570 blocks
            voting_period_in_blocks: 6570,

            // Minimum % of the total supply that need to vote for
            // proposal to be valid after the time for proposal has ended
            voting_quorum_fraction: 0,

            // Minimum # of token a user needs to be allowed to create a proposal
            proposal_token_threshold: 0,
        });
        
        console.log(
            "✅ Successfully deployed vote contract, address:",
            voteContractAddress,
        ); // 0x3E62046687f3A20d5D167f3aE248f652AD29aa32
    } catch (err) {
        console.error("Failed to deploy vote contract", err);
    }
})();