import * as anchor from "@coral-xyz/anchor";
import * as web3 from "@solana/web3.js";

import idl from "../target/idl/solana_cdt_bridge.json";
import PrivateKey from "/Users/jeremyguyet/.config/solana/id.json";

const programId = new web3.PublicKey( // Bridge program id from the deployment
  "H2Vh11em6b2aWaVFghChdh1nC8A2zxDiZn9QPtHBir49"
);

const wallet = new anchor.Wallet(
  web3.Keypair.fromSecretKey(Uint8Array.from(PrivateKey))
);

const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));
const provider = new anchor.AnchorProvider(connection, wallet, {});
const program = new anchor.Program(idl as anchor.Idl, programId, provider);

const askWithdraw = async () => {
  const [bridgeInfo] = await web3.PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("bridge_info")],
    new web3.PublicKey(programId)
  );
  const tx = await program.methods
    .askWithdraw()
    .accounts({ bridgeInfo, authority: wallet.publicKey })
    .signers([wallet.payer])
    .rpc();

  console.log(tx);
};

(async () => {
  await askWithdraw();
})();
