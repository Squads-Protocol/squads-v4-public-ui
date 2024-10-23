import CreateSquadForm from "@/components/CreateSquadForm";
import { Card, CardContent } from "@/components/ui/card";
import { PROGRAM_ID } from "@sqds/multisig";
import { cookies, headers } from "next/headers";

export default async function CreateSquad() {
  const rpcUrl = headers().get("x-rpc-url");
  const programId = cookies().get("x-program-id")?.value;

  return (
    <div className="">
      <div className="flex-col space-y-1 mb-4">
        <h1 className="text-3xl font-bold">Create a Squad</h1>
        <h3 className="text-base text-slate-500">
          Create a Squad and set it as your default account.
        </h3>
      </div>
      <Card className="pt-5">
        <CardContent>
          <CreateSquadForm
            rpc={rpcUrl!}
            programId={programId ? programId : PROGRAM_ID.toBase58()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
