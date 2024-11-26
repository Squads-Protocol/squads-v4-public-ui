import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";

export async function getTokenMetadata(metaplex: Metaplex, mint: PublicKey) {
  try {
    const meta = await metaplex.nfts().findByMint({
      mintAddress: mint,
    });

    if (meta.jsonLoaded) {
      return meta.json;
    }
  } catch (e) {
    return null;
  }
}
