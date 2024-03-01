import * as anchor from "@coral-xyz/anchor"
import * as web3 from "@solana/web3.js"
import * as splToken from "@solana/spl-token"

import idl from "../target/idl/solana_cdt_bridge.json"
import PrivateKey from "/Users/jeremyguyet/.config/solana/id.json"

const programId = new web3.PublicKey( // Bridge program id from the deployment
  "399S45kbptL4XmAc8fzwPRQ6yjGgkGcX9iYtZgrUNb1X"
)
const dexPool = new web3.PublicKey( // USDC / WSOL pair address
  "2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv"
)
const cdtToken = new web3.PublicKey( // CDT token mint address
  "Ak3ovnWQnAxPSFoSNCoNYJLnJtQDCKRBH4HwhWkb6hFm"
)
const usdcToken = new web3.PublicKey( // USDC token mint address
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
)
const wsolToken = new web3.PublicKey( // WSOL mint address
  "So11111111111111111111111111111111111111112"
)

const wallet = new anchor.Wallet(
  web3.Keypair.fromSecretKey(Uint8Array.from(PrivateKey))
)

const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"))
const provider = new anchor.AnchorProvider(connection, wallet, {})
const program = new anchor.Program(idl as anchor.Idl, programId, provider)

const initialize = async () => {
  const [bridgeInfo] = await web3.PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("bridge_info")],
    new web3.PublicKey(programId)
  )
  const [vaultsToken] = await anchor.web3.PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("bridge_token_vaults"),
      cdtToken.toBuffer(),
    ],
    program.programId
  )
  const tx = await program.methods
    .initialize("SOL", new anchor.BN(10_000_000_000), new anchor.BN(0))
    .accounts({
      bridgeInfo,
      authority: wallet.publicKey,
      systemProgram: web3.SystemProgram.programId,
      tokenMint: cdtToken,
      tokenVaults: vaultsToken,
      dexInTokenMint: usdcToken,
      dexOutTokenMint: wsolToken,
      dexPool: dexPool,
      tokenProgram: splToken.TOKEN_PROGRAM_ID,
    })
    .signers([wallet.payer])
    .rpc()

  console.log(tx)
}

;(async () => {
  await initialize()
})()
