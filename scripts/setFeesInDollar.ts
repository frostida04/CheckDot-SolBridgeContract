import * as anchor from "@coral-xyz/anchor"
import * as web3 from "@solana/web3.js"

import idl from "../target/idl/solana_cdt_bridge.json"
import PrivateKey from "/Users/jeremyguyet/.config/solana/id.json"

const programId = new web3.PublicKey( // Bridge program id from the deployment
  "5PhA4GUPKdMzY1CArmppCNcMBvDE2DiLkFQbrseqzKX5"
)

const wallet = new anchor.Wallet(
  web3.Keypair.fromSecretKey(Uint8Array.from(PrivateKey))
)

const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"))
const provider = new anchor.AnchorProvider(connection, wallet, {})
const program = new anchor.Program(idl as anchor.Idl, programId, provider)

const setFeesInDollar = async () => {
  const [bridgeInfo] = await web3.PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("bridge_info")],
    new web3.PublicKey(programId)
  )

  const tx = await program.methods
    .setFeesInDollar(new anchor.BN(200_000_000_000))
    .accounts({
      authority: wallet.publicKey,
      bridgeInfo,
    })
    .signers([wallet.payer])
    .rpc()

  console.log(tx)
}

;(async () => {
  await setFeesInDollar()
})()
