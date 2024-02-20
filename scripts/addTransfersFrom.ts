import * as anchor from "@coral-xyz/anchor";
import * as web3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";

import idl from "../target/idl/solana_cdt_bridge.json";
import PrivateKey from "/Users/jeremyguyet/.config/solana/id.json";

const programId = new web3.PublicKey( // Bridge program id from the deployment
  "399S45kbptL4XmAc8fzwPRQ6yjGgkGcX9iYtZgrUNb1X"
);
const cdtToken = new web3.PublicKey( // CDT token mint address
  "Ak3ovnWQnAxPSFoSNCoNYJLnJtQDCKRBH4HwhWkb6hFm"
);

const wallet = new anchor.Wallet(
  web3.Keypair.fromSecretKey(Uint8Array.from(PrivateKey))
);
// console.log(web3.clusterApiUrl("mainnet-beta"));
const connection = new web3.Connection('https://solana-mainnet.core.chainstack.com/90b1a03e7d63d7dafdefe698039b7056');
const provider = new anchor.AnchorProvider(connection, wallet, {});
const program = new anchor.Program(idl as anchor.Idl, programId, provider);

const addTransfersFrom = async () => {
  const [bridgeInfo] = await web3.PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("bridge_info")],
    new web3.PublicKey(programId)
  );
  const [vaultsToken] = await anchor.web3.PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("bridge_token_vaults"),
      cdtToken.toBuffer(),
    ],
    program.programId
  );
  const walletATA = await splToken.getAssociatedTokenAddress(
    cdtToken,
    wallet.publicKey
  );

  // account to get transfers
  const newAccount1 = web3.Keypair.generate();//new web3.PublicKey("6wgoAymdY5XeueNTkHgE18XyaZxQJGuxRSdP5JgmgN1p")//.Keypair.generate();
  await program.provider.connection.confirmTransaction(
    await program.provider.connection.requestAirdrop(
      newAccount1.publicKey,
      100 * web3.LAMPORTS_PER_SOL
    )
  );
  // const newAccount2 = web3.Keypair.generate();
  // await program.provider.connection.confirmTransaction(
  //   await program.provider.connection.requestAirdrop(
  //     newAccount2.publicKey,
  //     100 * web3.LAMPORTS_PER_SOL
  //   )
  // );

  const newATA1 = await splToken.getAssociatedTokenAddress(
    cdtToken,
    newAccount1.publicKey
  );
  // const newATA2 = await splToken.getAssociatedTokenAddress(
  //   cdtToken,
  //   newAccount2.publicKey
  // );


  const tx = await program.methods
    .addTransfersFrom(
      ["BSC"],//["1", "2"],
      [new anchor.BN(100_000_000)],//[new anchor.BN(500), new anchor.BN(5000)],
      ["6wgoAymdY5XeueNTkHgE18XyaZxQJGuxRSdP5JgmgN1p"]//["1", "2"]
    )
    .accounts({
      authority: wallet.publicKey,
      bridgeInfo,
      tokenProgram: splToken.TOKEN_PROGRAM_ID,
      associatedTokenProgram: splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenVaults: vaultsToken,
      systemProgram: web3.SystemProgram.programId,
      tokenMint: cdtToken,
      senderToken: walletATA,
    })
    .remainingAccounts([
      { pubkey: newAccount1.publicKey, isSigner: false, isWritable: true },
      { pubkey: newATA1, isSigner: false, isWritable: true },
      // { pubkey: newAccount2.publicKey, isSigner: false, isWritable: true },
      // { pubkey: newATA2, isSigner: false, isWritable: true },
    ])
    .signers([wallet.payer])
    .rpc();

  console.log(tx);
};

(async () => {
  await addTransfersFrom();
})()