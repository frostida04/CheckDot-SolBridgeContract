import * as anchor from "@coral-xyz/anchor"
import * as web3 from "@solana/web3.js"

const programId = new web3.PublicKey( // Bridge program id from the deployment
  "399S45kbptL4XmAc8fzwPRQ6yjGgkGcX9iYtZgrUNb1X"
)
const cdtToken = new web3.PublicKey( // CDT token mint address
  "Ak3ovnWQnAxPSFoSNCoNYJLnJtQDCKRBH4HwhWkb6hFm"
)

const connection = new web3.Connection(
  "https://solana-mainnet.core.chainstack.com/90b1a03e7d63d7dafdefe698039b7056"
)

export const getWithdrawableSOL = async () => {
  const [vaultsNative] = await anchor.web3.PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode("bridge_native_vaults")],
    programId
  )

  const data = await connection.getBalance(vaultsNative)
  return data
}
;(async () => {
  console.log(await getWithdrawableSOL())
  process.exit(0)
})()
