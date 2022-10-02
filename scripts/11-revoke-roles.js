import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0x76E588796f14ee43c031296e2c3DD3a6ceb3e3FE");

(async () => {
    try {
        // Log current roles
        const allRoles = await token.roles.getAll();
        console.log("👀 Roles that exist right now:", allRoles);

        // Revoke our wallet roles over the ERC-20 contract
        await token.roles.setAll({ admin: [], minter: [] });
        console.log(
            "🎉 Roles after revoking ourselves",
            await token.roles.getAll()
        );
        console.log("✅ Successfully revoked our superpowers from the ERC-20 contract")
    } catch (error) {
        console.error("Failed to revoke ourselves from the DAO treasury", error);
    }
})();