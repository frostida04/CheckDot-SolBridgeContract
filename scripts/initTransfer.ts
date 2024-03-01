import * as anchor from "@coral-xyz/anchor"
import * as web3 from "@solana/web3.js"
import * as splToken from "@solana/spl-token"

import idl from "../target/idl/solana_cdt_bridge.json"
import PrivateKey from "/Users/jeremyguyet/.config/solana/id.json"

const programId = new web3.PublicKey( // Bridge program id from the deployment
  "399S45kbptL4XmAc8fzwPRQ6yjGgkGcX9iYtZgrUNb1X"
)
const cdtToken = new web3.PublicKey( // CDT token mint address
  "Ak3ovnWQnAxPSFoSNCoNYJLnJtQDCKRBH4HwhWkb6hFm"
)

const wallet = new anchor.Wallet(
  web3.Keypair.fromSecretKey(Uint8Array.from(PrivateKey))
)

const solFeeRecipient = new web3.PublicKey("")

const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"))
const provider = new anchor.AnchorProvider(connection, wallet, {})
const program = new anchor.Program(idl as anchor.Idl, programId, provider)

const initTransfer = async () => {
  const index = 0

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
  const [bridgeTransfer] = await anchor.web3.PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("bridge_transfer"),
      new anchor.BN(index).toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  )
  const walletATA = await splToken.getAssociatedTokenAddress(
    cdtToken,
    wallet.publicKey
  )
  const dexPoolUsdcATA = new web3.PublicKey(
    "4d35yC7C8zhCDec7JbPptL9SEb4NUddKHxURgmvD8hfo"
  )
  const dexPoolWsolATA = new web3.PublicKey(
    "E2BcoCeJLTa27mAXDA4xwEq3pBUcyH6XXEHYk4KvKYTv"
  )

  const tx = await program.methods
    .initTransfer(
      new anchor.BN(100_000_000),
      "BSC",
      "0x961a14bEaBd590229B1c68A21d7068c8233C8542"
    )
    .accounts({
      authority: wallet.publicKey,
      bridgeInfo,
      poolInToken: dexPoolUsdcATA,
      poolOutToken: dexPoolWsolATA,
      senderToken: walletATA,
      systemProgram: web3.SystemProgram.programId,
      tokenProgram: splToken.TOKEN_PROGRAM_ID,
      solFeeRecipient,
      tokenVaults: vaultsToken,
      bridgeTransfer,
    })
    .signers([wallet.payer])
    .rpc()

  console.log(tx)
}

;(async () => {
  await initTransfer()
})()
