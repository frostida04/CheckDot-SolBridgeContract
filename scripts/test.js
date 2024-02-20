const anchor = require("@coral-xyz/anchor");
const web3 = require("@solana/web3.js");
const splToken = require("@solana/spl-token");
const fs = require('fs');

const idl = JSON.parse(fs.readFileSync("../target/idl/solana_cdt_bridge.json").toString());
const PrivateKey = JSON.parse(fs.readFileSync("/Users/jeremyguyet/.config/solana/id.json").toString());

// program Id before deploy AV4S1dHHdvdt9GZpDzfwjhfgpY79J3w3kPrTWNvFQEuj
// Address of the bridge H2Vh11em6b2aWaVFghChdh1nC8A2zxDiZn9QPtHBir49
const programId = new web3.PublicKey( // Bridge program id from the deployment
  "H2Vh11em6b2aWaVFghChdh1nC8A2zxDiZn9QPtHBir49"
);
const dexPool = new web3.PublicKey( // USDC / WSOL pair address
  "2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv"
);
const cdtToken = new web3.PublicKey( // CDT token mint address
  "Ak3ovnWQnAxPSFoSNCoNYJLnJtQDCKRBH4HwhWkb6hFm"
);
const usdcToken = new web3.PublicKey( // USDC token mint address
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
);
const wsolToken = new web3.PublicKey( // WSOL mint address
  "So11111111111111111111111111111111111111112"
);

const wallet = new anchor.Wallet(
  web3.Keypair.fromSecretKey(Uint8Array.from(PrivateKey))
);

const connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));
const provider = new anchor.AnchorProvider(connection, wallet, {});
const program = new anchor.Program(idl, programId, provider);

const initialize = async () => {

  const collectionPDAAccount = await program.provider.connection.getAccountInfo(new web3.PublicKey("AZLC4L5obaW5scA2FAwWkeH3oSQwtno77FVdLMGghcLL"));
  console.log(collectionPDAAccount.data.toString());
};

(async () => {
  await initialize();
})();
