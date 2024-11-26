import CreateSquadForm from "@/components/create/create-squad-form";
import PageHeader from "@/components/layout/page-header";
import SectionHeader from "@/components/layout/section-header";
import { Card, CardContent } from "@/components/ui/primitives/card";
import { PROGRAM_ID } from "@sqds/multisig";
import { cookies, headers } from "next/headers";

export default async function CreateSquad() {
  const rpcUrl = headers().get("x-rpc-url");
  const programId = cookies().get("x-program-id")?.value;

  return (
    <div className="">
      <SectionHeader
        title="Create"
        description="Create a multisig on the current cluster."
      />
      <section className="px-8 my-14">
        <Card className="pt-5 font-neue dark:bg-darkforeground dark:border-darkborder/30">
          <CardContent>
            <CreateSquadForm
              rpc={rpcUrl!}
              programId={programId ? programId : PROGRAM_ID.toBase58()}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
