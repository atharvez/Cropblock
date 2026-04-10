const fs = require('fs');
const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

async function main() {
    console.log("Generating Admin Keypair...");
    const adminKeypair = Keypair.generate();
    
    console.log(`\n==============================================`);
    console.log(`Admin Wallet Public Key: ${adminKeypair.publicKey.toBase58()}`);
    console.log(`==============================================\n`);
    
    console.log("WAIT! Devnet airdrops often fail through scripts due to rate limits.");
    console.log("Please go to https://faucet.solana.com/ and airdrop 1 or 2 SOL to the Public Key above.");
    console.log("Once you have successfully airdropped SOL in the browser, press Enter to continue...");
    
    await new Promise(resolve => process.stdin.once('data', () => resolve()));
    
    console.log("Checking balance...");
    const balance = await connection.getBalance(adminKeypair.publicKey);
    if (balance === 0) {
        console.error("Wallet balance is still 0. You need SOL to create a token. Please airdrop using the web faucet and try this script again.");
        return;
    }
    
    console.log("Creating SPL Token Mint...");
    const mint = await createMint(
        connection,
        adminKeypair,
        adminKeypair.publicKey,
        adminKeypair.publicKey,
        9
    );
    console.log(`Token Mint Created: ${mint.toBase58()}`);

    console.log("Creating Associated Token Account for Admin...");
    const adminTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        adminKeypair,
        mint,
        adminKeypair.publicKey
    );

    console.log("Minting initial supply (1,000,000 tokens) to Admin ATA...");
    await mintTo(
        connection,
        adminKeypair,
        mint,
        adminTokenAccount.address,
        adminKeypair,
        1000000 * Math.pow(10, 9)
    );
    console.log("Minting successful!");

    const secretKeyArray = Array.from(adminKeypair.secretKey);
    const envContent = `PORT=5001\nDB_HOST=localhost\nDB_USER=root\nDB_PASSWORD=\nDB_NAME=solana_scm\n\n# Solana\nSOLANA_NETWORK=devnet\nMINT_PUBLIC_KEY=${mint.toBase58()}\nSECRET_KEY=${JSON.stringify(secretKeyArray)}\n`;
    fs.writeFileSync('.env', envContent);
    console.log("Successfully wrote configuration to server/.env. You are ready to run the server!");
    process.exit(0);
}

main().catch(console.error);
