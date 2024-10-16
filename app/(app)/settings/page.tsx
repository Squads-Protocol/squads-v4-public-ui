import PageHeader from "@/components/ui/layout/page-header";
import RPCConfig from "@/components/ui/settings/RPCConfig";

const SettingsPage = () => {
  return (
    <div>
      <PageHeader heading="Settings" />
      <RPCConfig />
    </div>
  );
};

export default SettingsPage;
