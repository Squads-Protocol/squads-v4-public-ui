"use client"

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
import { useCookie } from '@/app/(app)/cookies';
import { useMultisig } from '@/app/(app)/services';

const ConfigurationPage = () => {
  const rpcUrl = useCookie("x-rpc-url");

  const connection = new Connection(rpcUrl || clusterApiUrl("mainnet-beta"));
  const multisigAddress = useCookie("x-multisig");
  const vaultIndex = Number(useCookie("x-vault-index"));
  const programIdCookie = useCookie("x-program-id");
  const programId = programIdCookie
    ? new PublicKey(programIdCookie!)
    : multisig.PROGRAM_ID;

  const {data: multisigConfig} = useMultisig(connection, multisigAddress!)
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
            {multisigConfig && multisigConfig.members.map((member) => (
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
                      multisigPda={multisigAddress!}
                      transactionIndex={
                        Number(multisigConfig ? multisigConfig.transactionIndex : 0) + 1
                      }
                      programId={
                        programId.toBase58()
                          ? programId.toBase58()
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
              multisigPda={multisigAddress!}
              rpcUrl={rpcUrl || clusterApiUrl("mainnet-beta")}
              transactionIndex={Number(multisigConfig ? multisigConfig.transactionIndex : 0) + 1}
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
              multisigPda={multisigAddress!}
              rpcUrl={rpcUrl || clusterApiUrl("mainnet-beta")}
              transactionIndex={Number(multisigConfig ? multisigConfig.transactionIndex : 0) + 1}
              programId={
                programIdCookie
                  ? programIdCookie
                  : multisig.PROGRAM_ID.toBase58()
              }
            />
          </CardContent>
        </Card>
      </div>
      {multisigConfig && (
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
              multisigPda={multisigAddress!}
              rpcUrl={rpcUrl || clusterApiUrl("mainnet-beta")}
              transactionIndex={Number(multisigConfig ? multisigConfig.transactionIndex : 0) + 1}
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
      )}
    </div>
  );
};

export default ConfigurationPage;
