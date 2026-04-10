const fs = require('fs');
const {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
} = require('@solana/web3.js');
const {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
} = require('@solana/spl-token');

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

async function main() {
    console.log("Generating Admin Keypair...");
    const adminKeypair = Keypair.generate();
    
    const secretKeyArray = Array.from(adminKeypair.secretKey);
    const secretKeyString = JSON.stringify(secretKeyArray);
    
    console.log(`Admin Wallet Public Key: ${adminKeypair.publicKey.toBase58()}`);
    
    console.log("Requesting 2 SOL Airdrop to Admin Wallet...");
    try {
        const airdropSignature = await connection.requestAirdrop(
            adminKeypair.publicKey,
            0.1 * LAMPORTS_PER_SOL
        );
        const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: airdropSignature,
        });
        console.log("Airdrop successful.");
    } catch (e) {
         console.warn("Airdrop might have failed or rate limited. Trying to proceed if wallet already had SOL (unlikely). If creating mint fails, please run script again later or fund wallet manually via faucet.", e.message);
    }
    
    console.log("Creating SPL Token Mint...");
    let mint;
    try {
        mint = await createMint(
            connection,
            adminKeypair,            // Payer
            adminKeypair.publicKey,  // Mint Authority
            adminKeypair.publicKey,  // Freeze Authority
            9                        // Decimals (9 is standard)
        );
        console.log(`Token Mint Created: ${mint.toBase58()}`);
    } catch (e) {
        console.error("Failed to create mint. Ensure you have SOL from the Devnet faucet at https://faucet.solana.com for address:", adminKeypair.publicKey.toBase58());
        return;
    }

    console.log("Creating Associated Token Account for Admin...");
    let adminTokenAccount;
    try {
        adminTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            adminKeypair,
            mint,
            adminKeypair.publicKey
        );
        console.log(`Admin ATA Created: ${adminTokenAccount.address.toBase58()}`);
    } catch (e) {
        console.error("Failed to create ATA", e);
        return;
    }

    const INITIAL_SUPPLY = Buffer.from("1000000000000000"); // 1,000,000 tokens with 9 decimals = 1,000,000 * 10^9 = 1,000,000,000,000,000

    console.log("Minting initial supply to Admin ATA...");
    try {
        await mintTo(
            connection,
            adminKeypair,
            mint,
            adminTokenAccount.address,
            adminKeypair,
            1000000 * Math.pow(10, 9)
        );
        console.log("Minting successful!");
    } catch (e) {
        console.error("Failed to mint to ATA", e);
        return;
    }

    // Write to server/.env
    const envContent = `PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=solana_scm

# Solana Config
SOLANA_NETWORK=devnet
MINT_PUBLIC_KEY=${mint.toBase58()}
SECRET_KEY=${secretKeyString}
`;
    fs.writeFileSync('server/.env', envContent);
    console.log("Successfully wrote configuration to server/.env");
}

main().catch(console.error);
