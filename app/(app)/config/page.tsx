import AddMemberInput from "@/components/AddMemberInput";
import ChangeThresholdInput from "@/components/ChangeThresholdInput";
import ChangeUpgradeAuthorityInput from "@/components/ChangeUpgradeAuthorityInput";
import RemoveMemberButton from "@/components/RemoveMemberButton";
import Chip from "@/components/ui/chip";
import PageHeader from "@/components/ui/layout/page-header";
import CopyTextButton from "@/components/ui/misc/copy-text";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/primitives/card";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";
import { cookies, headers } from "next/headers";
const ConfigurationPage = async () => {
  const rpcUrl = headers().get("x-rpc-url");

  const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"));
  const multisigCookie = headers().get("x-multisig");
  const multisigPda = new PublicKey(multisigCookie!);
  const vaultIndex = Number(headers().get("x-vault-index"));
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
      <PageHeader heading="Squad Config" />
      <Card className="dark:bg-darkforeground dark:border-darkborder/30">
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription className="text-stone-500 dark:text-white/50">
            List of members in the multisig as well as their permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-3 space-y-8">
            {multisigInfo.members.map((member) => (
              <div key={member.key.toBase58()}>
                <div className="flex items-center">
                  <div className="ml-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-medium leading-none">
                        {member.key.toString().slice(0, 4) +
                          "..." +
                          member.key.toString().slice(-4)}
                      </p>
                      <CopyTextButton text={member.key.toString()} />
                    </div>
                    <p className="inline-flex gap-2 items-center text-sm text-stone-500 dark:text-white/50">
                      Permissions:{" "}
                      {member.permissions.mask == 1 ? (
                        <Chip label="Proposer" color="blue" />
                      ) : member.permissions.mask == 2 ? (
                        <Chip label="Voter" color="green" />
                      ) : member.permissions.mask == 4 ? (
                        <Chip label="Executor" color="orange" />
                      ) : (
                        <Chip label="All" color="yellow" />
                      )}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <RemoveMemberButton
                      rpcUrl={rpcUrl || clusterApiUrl("mainnet-beta")}
                      memberKey={member.key.toBase58()}
                      multisigPda={multisigCookie!}
                      transactionIndex={
                        Number(multisigInfo.transactionIndex) + 1
                      }
                      programId={
                        programId.toBase58()
                          ? programId.toBase58()
                          : multisig.PROGRAM_ID.toBase58()
                      }
                    />
                  </div>
                </div>
                <hr className="mt-2 dark:border-darkborder/30" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex pb-4">
        <Card className="mt-4 w-1/2 mr-2 dark:bg-darkforeground dark:border-darkborder/30">
          <CardHeader>
            <CardTitle>Add Member</CardTitle>
            <CardDescription className="text-stone-500 dark:text-white/50">
              Add a member to the Multisig
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddMemberInput
              multisigPda={multisigCookie!}
              rpcUrl={rpcUrl || clusterApiUrl("mainnet-beta")}
              transactionIndex={Number(multisigInfo.transactionIndex) + 1}
              programId={
                programIdCookie
                  ? programIdCookie
                  : multisig.PROGRAM_ID.toBase58()
              }
            />
          </CardContent>
        </Card>
        <Card className="mt-4 w-1/2 dark:bg-darkforeground dark:border-darkborder/30">
          <CardHeader>
            <CardTitle>Change Threshold</CardTitle>
            <CardDescription className="text-stone-500 dark:text-white/50">
              Change the threshold required to execute a multisig transaction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangeThresholdInput
              multisigPda={multisigCookie!}
              rpcUrl={rpcUrl || clusterApiUrl("mainnet-beta")}
              transactionIndex={Number(multisigInfo.transactionIndex) + 1}
              programId={
                programIdCookie
                  ? programIdCookie
                  : multisig.PROGRAM_ID.toBase58()
              }
            />
          </CardContent>
        </Card>
      </div>
      <div className="pb-4">
        <Card className="w-1/2 dark:bg-darkforeground dark:border-darkborder/30">
          <CardHeader>
            <CardTitle>Change Program Upgrade Authority</CardTitle>
            <CardDescription className="text-stone-500 dark:text-white/50">
              Change the upgrade authority of one of your programs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangeUpgradeAuthorityInput
              multisigPda={multisigCookie!}
              rpcUrl={rpcUrl || clusterApiUrl("mainnet-beta")}
              transactionIndex={Number(multisigInfo.transactionIndex) + 1}
              vaultIndex={vaultIndex}
              globalProgramId={
                programIdCookie
                  ? programIdCookie
                  : multisig.PROGRAM_ID.toBase58()
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfigurationPage;
