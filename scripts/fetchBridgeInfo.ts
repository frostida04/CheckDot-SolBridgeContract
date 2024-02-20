import * as anchor from "@coral-xyz/anchor"
import * as web3 from "@solana/web3.js"
import * as borsh from "@coral-xyz/borsh"

const BridgeInfoLayout = borsh.struct([
  borsh.publicKey("token"),
  borsh.publicKey("owner"),
  borsh.publicKey("program"),
  borsh.str("chain"),
  borsh.u64("fees_in_dollar"),
  borsh.u64("fees_in_cdt_percentage"),
  borsh.u64("minimum_transfer_quantity"),
  borsh.u64("bridge_fees_in_cdt"),
  borsh.u64("lock_ask_duration"),
  borsh.u64("unlock_ask_duration"),
  borsh.u64("unlock_ask_time"),
  borsh.u64("transfers_length"),
  borsh.publicKey("dex_in"),
  borsh.publicKey("dex_out"),
  borsh.publicKey("dex_pool"),
  borsh.bool("paused"),
])

const programId = new web3.PublicKey( // Bridge program id from the deployment
  "399S45kbptL4XmAc8fzwPRQ6yjGgkGcX9iYtZgrUNb1X"
)

const connection = new web3.Connection('https://solana-mainnet.core.chainstack.com/90b1a03e7d63d7dafdefe698039b7056')

export const fetchBridgeInfo = async () => {
  const [bridgeInfo] = await web3.PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("bridge_info")],
    new web3.PublicKey(programId)
  )
  const data = await connection.getAccountInfo(bridgeInfo)
  const decoded = BridgeInfoLayout.decode(data.data.slice(8))
  return decoded
}

(async () => {
  console.log((await fetchBridgeInfo()))
  process.exit(0)
})()
