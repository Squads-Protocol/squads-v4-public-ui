import PageHeader from "@/components/layout/page-header";
import RPCConfig from "@/components/settings/set-rpc";

const SettingsPage = () => {
  return (
    <div>
      <PageHeader heading="Settings" />
      <RPCConfig />
    </div>
  );
};

export default SettingsPage;
