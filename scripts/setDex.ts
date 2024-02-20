import * as anchor from "@coral-xyz/anchor"
import * as web3 from "@solana/web3.js"

import idl from "../target/idl/solana_cdt_bridge.json"
import PrivateKey from "./privateKey.json"

const programId = new web3.PublicKey( // Bridge program id from the deployment
  "H2Vh11em6b2aWaVFghChdh1nC8A2zxDiZn9QPtHBir49"
)
const dexPool = new web3.PublicKey('2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv')
const dexPoolUsdcATA = new web3.PublicKey('4d35yC7C8zhCDec7JbPptL9SEb4NUddKHxURgmvD8hfo')
const dexPoolWsolATA = new web3.PublicKey('E2BcoCeJLTa27mAXDA4xwEq3pBUcyH6XXEHYk4KvKYTv')

const wallet = new anchor.Wallet(
  web3.Keypair.fromSecretKey(Uint8Array.from(PrivateKey))
)

const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"))
const provider = new anchor.AnchorProvider(connection, wallet, {})
const program = new anchor.Program(idl as anchor.Idl, programId, provider)

const setDex = async () => {
  const [bridgeInfo] = await web3.PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("bridge_info")],
    new web3.PublicKey(programId)
  )

  const tx = await program.methods
    .setDex()
    .accounts({
      authority: wallet.publicKey,
      bridgeInfo,
      dexInTokenMint: dexPoolUsdcATA,
      dexOutTokenMint: dexPoolWsolATA,
      dexPool: dexPool
    })
    .signers([wallet.payer])
    .rpc()

  console.log(tx)
}
