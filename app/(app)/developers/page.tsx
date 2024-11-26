import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";
import { cookies, headers } from "next/headers";
import SectionHeader from "@/components/layout/section-header";
import ChangeUpgradeAuth from "@/components/config/change-upgrade-auth";

export default async function Configuration() {
  const rpcUrl = headers().get("x-rpc-url");
  const vaultIndex = Number(headers().get("x-vault-index"));
  const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"));
  const multisigCookie = headers().get("x-multisig");
  const multisigPda = new PublicKey(multisigCookie!);
  const programIdCookie = cookies().get("x-program-id")?.value;
  const programId = programIdCookie
    ? new PublicKey(programIdCookie!)
    : multisig.PROGRAM_ID;

  const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
    connection,
    multisigPda
  );

  return (
    <div className="font-neue">
      <SectionHeader
        title="Developers"
        description="Manage authorities for programs and tokens."
      />
      <section className="px-8 my-14">
        <ChangeUpgradeAuth
          multisigPda={multisigCookie!}
          rpcUrl={rpcUrl || clusterApiUrl("mainnet-beta")}
          transactionIndex={
            multisigInfo.transactionIndex
              ? Number(multisigInfo.transactionIndex) + 1
              : 1
          }
          vaultIndex={vaultIndex}
          programId={
            programIdCookie ? programIdCookie : multisig.PROGRAM_ID.toBase58()
          }
        />
      </section>
    </div>
  );
}
