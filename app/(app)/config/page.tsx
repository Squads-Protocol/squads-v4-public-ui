import AddMemberInput from "@/components/AddMemberInput";
import ChangeThresholdInput from "@/components/ChangeThresholdInput";
import ChangeUpgradeAuthorityInput from "@/components/ChangeUpgradeAuthorityInput";
import RemoveMemberButton from "@/components/RemoveMemberButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";
import { headers } from "next/headers";
const ConfigurationPage = async () => {
  const rpcUrl = headers().get("x-rpc-url");

  const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"));
  const multisigCookie = headers().get("x-multisig");
  const multisigPda = new PublicKey(multisigCookie!);
  const vaultIndex = Number(headers().get("x-vault-index"));
  const programIdCookie = headers().get("x-program-id");
  const programId = new PublicKey(programIdCookie!);

  const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
    connection,
    multisigPda
  );
  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-4">Multisig Configuration</h1>
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            List of members in the multisig as well as their permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {multisigInfo.members.map((member) => (
              <div key={member.key.toBase58()}>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Public Key: {member.key.toBase58()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Permission Mask:
                      {member.permissions.mask.toString()}
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
                        programIdCookie
                          ? programIdCookie
                          : multisig.PROGRAM_ID.toBase58()
                      }
                    />
                  </div>
                </div>
                <hr className="mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex pb-4">
        <Card className="mt-4 w-1/2 mr-2">
          <CardHeader>
            <CardTitle>Add Member</CardTitle>
            <CardDescription>Add a member to the Multisig</CardDescription>
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
        <Card className="mt-4 w-1/2">
          <CardHeader>
            <CardTitle>Change Threshold</CardTitle>
            <CardDescription>
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
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Change program Upgrade authority</CardTitle>
            <CardDescription>
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
