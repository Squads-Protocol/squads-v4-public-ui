import CreateSquadForm from "@/components/CreateSquadForm";
import PageHeader from "@/components/ui/layout/page-header";
import { Card, CardContent } from "@/components/ui/primitives/card";
import { headers } from "next/headers";

export default async function CreateSquad() {
  const rpcUrl = headers().get("x-rpc-url");

  return (
    <div className="">
      <PageHeader heading="Create a Squad" />
      <Card className="pt-5 font-neue dark:bg-darkforeground dark:border-darkborder/30">
        <CardContent>
          <CreateSquadForm rpc={rpcUrl!} />
        </CardContent>
      </Card>
    </div>
  );
}
