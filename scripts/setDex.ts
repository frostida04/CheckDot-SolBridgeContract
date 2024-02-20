import * as anchor from "@coral-xyz/anchor"
import * as web3 from "@solana/web3.js"

import idl from "../target/idl/solana_cdt_bridge.json"
import PrivateKey from "/Users/jeremyguyet/.config/solana/id.json";

const programId = new web3.PublicKey( // Bridge program id from the deployment
  "HoddZCKmLKWcs91npavV5uwQb829rHGVRKdToYqu96W7"
)
const dexPool = new web3.PublicKey('2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv')
const mintIn = new web3.PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
const mintOut = new web3.PublicKey('So11111111111111111111111111111111111111112')

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
      dexInTokenMint: mintIn,
      dexOutTokenMint: mintOut,
      dexPool: dexPool
    })
    .signers([wallet.payer])
    .rpc()

  console.log(tx)
}

(async () => {
  await setDex()
})();