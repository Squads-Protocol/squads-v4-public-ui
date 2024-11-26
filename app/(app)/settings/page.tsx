import PageHeader from "@/components/layout/page-header";
import SectionHeader from "@/components/layout/section-header";
import RPCConfig from "@/components/settings/set-rpc";

const SettingsPage = () => {
  return (
    <div>
      <SectionHeader
        title="Settings"
        description="Manage your client settings"
      />
      <section className="px-8 my-14">
        <RPCConfig />
      </section>
    </div>
  );
};

export default SettingsPage;
