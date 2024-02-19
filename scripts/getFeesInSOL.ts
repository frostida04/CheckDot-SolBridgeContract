import * as web3 from "@solana/web3.js"
import { BN } from "bn.js"
import { fetchBridgeInfo } from "./fetchBridgeInfo"

const dexPoolInATA = new web3.PublicKey( // dex pool ata of USDC token
  "4d35yC7C8zhCDec7JbPptL9SEb4NUddKHxURgmvD8hfo"
)
const dexPoolOutATA = new web3.PublicKey( // dex pool ata of WSOL token
  "E2BcoCeJLTa27mAXDA4xwEq3pBUcyH6XXEHYk4KvKYTv"
)

const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"))

export const getFeesInSOL = async () => {
  const amountIn = await connection.getTokenAccountBalance(dexPoolInATA)
  const amountOut = await connection.getTokenAccountBalance(dexPoolOutATA)

  const oneDollar = new BN(amountIn.value.amount)
    .mul(new BN(1_000_000_000))
    .div(new BN(amountOut.value.amount))

  const feesInDollar = (await fetchBridgeInfo()).fees_in_dollar
  const transferSOLFees = oneDollar
    .mul(new BN(1_000_000_000))
    .div(feesInDollar)
    .mul(new BN(100))
  return transferSOLFees
}

getFeesInSOL()
