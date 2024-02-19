import * as anchor from "@coral-xyz/anchor"
import * as web3 from "@solana/web3.js"
import * as borsh from "@coral-xyz/borsh"

const TransferInfoLayout = borsh.struct([
  borsh.str("hash"),
  borsh.publicKey("from"),
  borsh.publicKey("coin"),
  borsh.u64("quantity"),
  borsh.str("from_chain"),
  borsh.str("to_chain"),
  borsh.u64("fees_in_cdt"),
  borsh.u64("fees_in_sol"),
  borsh.u64("block_timestamp"),
  borsh.u64("block_number"),
  borsh.str("data"),
])

const programId = new web3.PublicKey( // Bridge program id from the deployment
  "H2Vh11em6b2aWaVFghChdh1nC8A2zxDiZn9QPtHBir49"
)

const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"))

export const fetchTransferInfo = async (index) => {
  const [bridgeTransfer] = await anchor.web3.PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode("bridge_transfer"),
      new anchor.BN(index).toArrayLike(Buffer, "le", 8),
    ],
    programId
  )
  console.log(bridgeTransfer.toString())
  const data = await connection.getAccountInfo(bridgeTransfer)
  const decoded = TransferInfoLayout.decode(data.data)
  return decoded
}

fetchTransferInfo(0)
