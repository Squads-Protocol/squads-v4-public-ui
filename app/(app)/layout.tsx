import RenderMultisigRoute from "@/components/render-route";
import { CustomToaster } from "@/components/layout/custom-toaster";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {

  return (
    <>
      <RenderMultisigRoute children={children} />
      <CustomToaster />
    </>
  );
};

export default AppLayout;
