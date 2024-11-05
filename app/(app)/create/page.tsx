import CreateSquadForm from "@/components/create/create-squad-form";
import PageHeader from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/primitives/card";
import { PROGRAM_ID } from "@sqds/multisig";
import { cookies, headers } from "next/headers";

export default async function CreateSquad() {
  const rpcUrl = headers().get("x-rpc-url");
  const programId = cookies().get("x-program-id")?.value;

  return (
    <div className="">
      <PageHeader heading="Create a Squad" />
      <Card className="pt-5 font-neue dark:bg-darkforeground dark:border-darkborder/30">
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
