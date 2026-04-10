const {
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
} = require('@solana/web3.js');
const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} = require('@solana/spl-token');

// Hardcoded Devnet RPC (can sometimes be rate limited, we'll try our best)
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

const setup = async () => {
    console.log("Starting Demo Currency Generation...");
    
    // We will generate a fresh wallet specifically for this demo to ensure a clean slate.
    const adminKeypair = Keypair.generate();
    console.log(`\nNew Admin Wallet Address: ${adminKeypair.publicKey.toBase58()}`);
    console.log(`Please save this Secret Key for your .env:`);
    console.log(`[${adminKeypair.secretKey.toString()}]`);

    // 1. Request Airdrop of SOL
    console.log("\nAttempting to request Devnet SOL Airdrop...");
    try {
        const airdropSignature = await connection.requestAirdrop(
            adminKeypair.publicKey,
            2 * LAMPORTS_PER_SOL // Request 2 SOL
        );
        
        const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: airdropSignature,
        });

        console.log(`Airdrop Success! Signature: ${airdropSignature}`);
    } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", "\nAirdrop failed. Solana Devnet is likely rate-limited in your region.");
        console.error("To proceed, you must manually fund this wallet with Devnet SOL.");
        console.error(`Go to: https://faucet.solana.com/`);
        console.error(`Paste this address: ${adminKeypair.publicKey.toBase58()}`);
        console.error(`Select Devnet, and request SOL.`);
        console.error(`Rerun this script AFTER you funded it.`);
        process.exit(1);
    }

    // 2. Create the Token Mint (Demo Currency)
    console.log("\nCreating SPL-Token Mint (Demo Currency)...");
    let mint;
    try {
        mint = await createMint(
            connection,
            adminKeypair,           // Payer
            adminKeypair.publicKey, // Mint Authority
            adminKeypair.publicKey, // Freeze Authority
            9                       // Decimals (Standard)
        );
        console.log(`\nDemo Currency Created! MINT_PUBLIC_KEY: \x1b[32m${mint.toBase58()}\x1b[0m`);
    } catch (e) {
        console.error("Failed to create mint:", e);
        process.exit(1);
    }

    // 3. Create Associated Token Account for Admin
    console.log("Creating Associated Token Account for Admin Wallet...");
    const adminTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        adminKeypair,
        mint,
        adminKeypair.publicKey
    );

    // 4. Mint 1,000,000 Demo Tokens to the Admin Wallet
    console.log("Minting 1,000,000 Demo Tokens to the Admin Wallet...");
    const amountToMint = 1000000 * Math.pow(10, 9);
    await mintTo(
        connection,
        adminKeypair,               // Payer
        mint,                       // Mint
        adminTokenAccount.address,  // Destination account
        adminKeypair,               // Mint Authority
        amountToMint
    );

    console.log("\n=== SUCCESS ===");
    console.log("Demo Currency is fully established onto the Devnet.");
    console.log("Please update your .env with these values:\n");
    console.log(`SECRET_KEY=[${adminKeypair.secretKey.toString()}]`);
    console.log(`MINT_PUBLIC_KEY=${mint.toBase58()}`);
};

setup();
