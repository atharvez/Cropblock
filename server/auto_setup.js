const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');
const fs = require('fs');

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log("Generating a keypair...");
    const adminKeypair = Keypair.generate();
    console.log("Public Key: ", adminKeypair.publicKey.toBase58());

    let airdropSuccess = false;
    for (let i = 0; i < 5; i++) {
        try {
            console.log(`Requesting airdrop (attempt ${i + 1})...`);
            const airdropSignature = await connection.requestAirdrop(
                adminKeypair.publicKey,
                LAMPORTS_PER_SOL * 1
            );
            const latestBlockHash = await connection.getLatestBlockhash();
            await connection.confirmTransaction({
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: airdropSignature,
            });
            console.log("Airdrop successful!");
            airdropSuccess = true;
            break;
        } catch (e) {
            console.log(`Airdrop attempt ${i + 1} failed: ${e.message}`);
            await sleep(5000);
        }
    }

    if (!airdropSuccess) {
        console.error("Failed to automatically get devnet SOL after 5 attempts.");
        console.error("Please fund the wallet manually at https://faucet.solana.com/ with this address: ", adminKeypair.publicKey.toBase58());
        // We will mock it instead of blocking
        console.log("Generating mock .env variables so the app can start (transactions may fail)...");
    } else {
        console.log("Wait 5s to ensure node sees balance...");
        await sleep(5000);
    }

    let mintPk = adminKeypair.publicKey.toBase58(); // Fallback dummy

    if (airdropSuccess) {
        try {
            console.log("Creating mint...");
            const mint = await createMint(connection, adminKeypair, adminKeypair.publicKey, adminKeypair.publicKey, 9);
            console.log(`Token Mint Created: ${mint.toBase58()}`);
            mintPk = mint.toBase58();

            const adminTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection, adminKeypair, mint, adminKeypair.publicKey
            );

            console.log("Minting initial supply...");
            await mintTo(connection, adminKeypair, mint, adminTokenAccount.address, adminKeypair, 1000000 * Math.pow(10, 9));
            console.log("Minted 1,000,000 to admin!");
        } catch (e) {
            console.error("Token setup failed: ", e.message);
        }
    }

    const envContent = `PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=solana_scm
SOLANA_NETWORK=devnet
MINT_PUBLIC_KEY=${mintPk}
SECRET_KEY=${JSON.stringify(Array.from(adminKeypair.secretKey))}
REACT_APP_API_URL=http://localhost:5001
`;
    fs.writeFileSync('.env', envContent);
    console.log("Successfully wrote configuration to .env");
}

main().catch(console.error);
