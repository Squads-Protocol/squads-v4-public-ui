import SectionHeader from "@/components/layout/section-header";
import ProgramIdConfig from "@/components/settings/set-programid";
import RPCConfig from "@/components/settings/set-rpc";

const SettingsPage = () => {
  return (
    <div>
      <SectionHeader
        title="Settings"
        description="Manage your client settings"
      />
      <section className="w-full grid grid-cols-2 gap-4 px-8 my-14">
        <RPCConfig />
        <ProgramIdConfig />
      </section>
    </div>
  );
};

export default SettingsPage;
