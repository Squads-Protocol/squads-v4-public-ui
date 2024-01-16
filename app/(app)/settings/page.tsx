import SetRpcUrlInput from "@/components/SetRpcUrlnput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SettingsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>RPC Url</CardTitle>
          <CardDescription>
            Change the default RPC Url for this app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SetRpcUrlInput />
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
