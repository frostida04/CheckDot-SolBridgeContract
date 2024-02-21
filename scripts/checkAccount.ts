import * as anchor from "@coral-xyz/anchor"
import * as web3 from "@solana/web3.js"
import * as splToken from "@solana/spl-token"

const connection = new web3.Connection(
  "https://solana-mainnet.core.chainstack.com/90b1a03e7d63d7dafdefe698039b7056"
)

const checkAccount = async () => {
  // account to get transfers
  const newAccount1 = new web3.PublicKey(
    "FCjku22Q7s1MNN2jK773nDYRduFGyXjE2tNWwynYmiJ6"
  )
  const data = await connection.getAccountInfo(newAccount1)
  console.log(data)
  return Boolean(data)
}

;(async () => {
  await checkAccount()
})()
