'use client';
import SetProgramIdInput from '@/components/SetProgramIdInput';
import SetRpcUrlInput from '@/components/SetRpcUrlnput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SettingsPage = () => {
  return (
    <main>
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <div className="flex-col space-y-4 justify-start">
        <Card>
          <CardHeader>
            <CardTitle>RPC Url</CardTitle>
            <CardDescription>Change the default RPC Url for this app.</CardDescription>
          </CardHeader>
          <CardContent>
            <SetRpcUrlInput />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Program ID</CardTitle>
            <CardDescription>Change the targeted program ID.</CardDescription>
          </CardHeader>
          <CardContent>
            <SetProgramIdInput />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SettingsPage;
